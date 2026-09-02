package no.effektiv.quiz

import kotlinx.coroutines.runBlocking
import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.Question
import no.effektiv.quiz.repository.QuestionRepository
import no.effektiv.quiz.service.InsufficientQuestionsException
import no.effektiv.quiz.service.QuestionService
import no.effektiv.quiz.service.RandomQuestionSelector
import no.effektiv.quiz.service.ValidationException
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import kotlin.random.Random
import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlin.test.assertNotEquals
import kotlin.test.assertNull

class QuestionServiceTest {
    @Test
    fun `creates a valid question at exact length boundaries`() = runBlocking {
        val repository = FakeQuestionRepository()
        val request = CreateQuestionRequest("q".repeat(500), listOf("a", "b", "c", "d").map { it.repeat(200) }, 3)

        val created = QuestionService(repository).create(request)

        assertEquals(request.question, created.question)
        assertEquals(request.alternatives, created.alternatives)
        assertEquals(3, created.correctAlternativeIndex)
        assertEquals(request, repository.created)
    }

    @Test
    fun `trims values before writing`() = runBlocking {
        val repository = FakeQuestionRepository()

        QuestionService(repository).create(validRequest(question = "  Question?  ", alternatives = listOf(" A ", " B ", " C ", " D ")))

        assertEquals("Question?", repository.created?.question)
        assertEquals(listOf("A", "B", "C", "D"), repository.created?.alternatives)
    }

    @Test
    fun `rejects alternatives duplicated after trim and case normalization`() = runBlocking {
        val exception = assertFailsWith<ValidationException> {
            QuestionService(FakeQuestionRepository()).create(validRequest(alternatives = listOf("One", " one ", "Two", "Three")))
        }

        assertEquals("alternatives", exception.errors.single().field)
    }

    @Test
    fun `reports all invalid fields and does not write`() = runBlocking {
        val repository = FakeQuestionRepository()
        val request = CreateQuestionRequest("   ", listOf("", " ", "a".repeat(201)), 4)

        val exception = assertFailsWith<ValidationException> {
            QuestionService(repository).create(request)
        }

        assertEquals(
            listOf("question", "alternatives", "alternatives[0]", "alternatives[1]", "alternatives[2]", "correctAlternativeIndex"),
            exception.errors.map { it.field },
        )
        assertNull(repository.created)
    }

    @Test
    fun `rejects an overlong question`() = runBlocking {
        val exception = assertFailsWith<ValidationException> {
            QuestionService(FakeQuestionRepository()).create(validRequest(question = "q".repeat(501)))
        }

        assertEquals("question", exception.errors.single().field)
    }

    @ParameterizedTest
    @ValueSource(ints = [0, 1, 2, 3, 5])
    fun `requires exactly four alternatives`(count: Int) = runBlocking {
        val exception = assertFailsWith<ValidationException> {
            QuestionService(FakeQuestionRepository()).create(validRequest(alternatives = List(count) { "option" }))
        }

        assertEquals("alternatives", exception.errors.first().field)
    }

    @ParameterizedTest
    @ValueSource(ints = [-1, 4, 100])
    fun `rejects a correct index outside zero through three`(index: Int) = runBlocking {
        val exception = assertFailsWith<ValidationException> {
            QuestionService(FakeQuestionRepository()).create(validRequest(index = index))
        }

        assertEquals("correctAlternativeIndex", exception.errors.single().field)
    }

    @Test
    fun `rejects a bank with fewer than ten questions`() = runBlocking {
        val repository = FakeQuestionRepository((1L..9L).map(::question))

        val exception = assertFailsWith<InsufficientQuestionsException> {
            QuestionService(repository).quiz()
        }

        assertEquals(9, exception.available)
    }

    @Test
    fun `seeded random selection is deterministic unique and limited to ten`() = runBlocking {
        val questions = (1L..15L).map(::question)
        val first = QuestionService(FakeQuestionRepository(questions), RandomQuestionSelector(Random(42))).quiz()
        val second = QuestionService(FakeQuestionRepository(questions), RandomQuestionSelector(Random(42))).quiz()

        assertEquals(first, second)
        assertEquals(10, first.size)
        assertEquals(10, first.map { it.id }.distinct().size)
        assertNotEquals(questions.take(10), first)
    }

    private fun validRequest(
        question: String = "Question?",
        alternatives: List<String> = listOf("A", "B", "C", "D"),
        index: Int = 0,
    ) = CreateQuestionRequest(question, alternatives, index)

    private fun question(id: Long) = Question(id, "Question $id", listOf("A", "B", "C", "D"), 0)

    private class FakeQuestionRepository(
        private val questions: List<Question> = emptyList(),
    ) : QuestionRepository {
        var created: CreateQuestionRequest? = null

        override suspend fun findAll() = questions

        override suspend fun create(request: CreateQuestionRequest): Question {
            created = request
            return Question(11, request.question, request.alternatives, request.correctAlternativeIndex)
        }
    }
}
