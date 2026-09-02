package no.effektiv.quiz.service

import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.FieldError
import no.effektiv.quiz.domain.Question
import no.effektiv.quiz.repository.QuestionRepository
import java.util.Locale
import kotlin.random.Random

class ValidationException(val errors: List<FieldError>) : RuntimeException("Question validation failed")

class InsufficientQuestionsException(val available: Int) :
    RuntimeException("At least ${QuestionService.QUIZ_SIZE} questions are required, but only $available are available")

fun interface QuestionSelector {
    fun select(questions: List<Question>, count: Int): List<Question>
}

class RandomQuestionSelector(private val random: Random = Random.Default) : QuestionSelector {
    override fun select(questions: List<Question>, count: Int): List<Question> =
        questions.shuffled(random).take(count)
}

class QuestionService(
    private val repository: QuestionRepository,
    private val selector: QuestionSelector = RandomQuestionSelector(),
) {
    suspend fun create(request: CreateQuestionRequest): Question {
        val normalized = request.copy(
            question = request.question.trim(),
            alternatives = request.alternatives.map(String::trim),
        )
        val errors = buildList {
            if (normalized.question.isBlank()) {
                add(FieldError("question", "must not be blank"))
            } else if (normalized.question.length > 500) {
                add(FieldError("question", "must contain at most 500 characters"))
            }

            if (normalized.alternatives.size != 4) {
                add(FieldError("alternatives", "must contain exactly 4 alternatives"))
            }
            normalized.alternatives.forEachIndexed { index, alternative ->
                if (alternative.isBlank()) {
                    add(FieldError("alternatives[$index]", "must not be blank"))
                } else if (alternative.length > 200) {
                    add(FieldError("alternatives[$index]", "must contain at most 200 characters"))
                }
            }
            val distinctAlternatives = normalized.alternatives
                .map { it.lowercase(Locale.ROOT) }
                .distinct()
            if (normalized.alternatives.size == 4 && distinctAlternatives.size != 4) {
                add(FieldError("alternatives", "must be distinct ignoring case and surrounding whitespace"))
            }

            if (request.correctAlternativeIndex !in 0..3) {
                add(FieldError("correctAlternativeIndex", "must be between 0 and 3"))
            }
        }
        if (errors.isNotEmpty()) throw ValidationException(errors)
        return repository.create(normalized)
    }

    suspend fun quiz(): List<Question> {
        val questions = repository.findAll()
        if (questions.size < QUIZ_SIZE) throw InsufficientQuestionsException(questions.size)
        return selector.select(questions, QUIZ_SIZE)
    }

    companion object {
        const val QUIZ_SIZE = 10
    }
}
