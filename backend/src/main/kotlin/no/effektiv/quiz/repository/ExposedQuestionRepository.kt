package no.effektiv.quiz.repository

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.Question
import org.jetbrains.exposed.v1.core.ReferenceOption
import org.jetbrains.exposed.v1.core.SortOrder
import org.jetbrains.exposed.v1.core.Table
import org.jetbrains.exposed.v1.core.dao.id.LongIdTable
import org.jetbrains.exposed.v1.jdbc.Database
import org.jetbrains.exposed.v1.jdbc.insert
import org.jetbrains.exposed.v1.jdbc.selectAll
import org.jetbrains.exposed.v1.jdbc.transactions.transaction

object Questions : LongIdTable("questions") {
    val text = varchar("question", 500)
}

object Alternatives : LongIdTable("question_alternatives") {
    val questionId = reference("question_id", Questions, onDelete = ReferenceOption.CASCADE)
    val position = integer("position")
    val text = varchar("alternative", 200)
    val correct = bool("is_correct")
}

class ExposedQuestionRepository(private val database: Database) : QuestionRepository {
    override suspend fun findAll(): List<Question> = dbQuery {
        val alternativesByQuestion = Alternatives.selectAll()
            .orderBy(
                Alternatives.questionId to SortOrder.ASC,
                Alternatives.position to SortOrder.ASC,
            )
            .groupBy({ it[Alternatives.questionId].value }) { it[Alternatives.text] to it[Alternatives.correct] }

        Questions.selectAll().orderBy(Questions.id).map { row ->
            Question(
                id = row[Questions.id].value,
                question = row[Questions.text],
                alternatives = alternativesByQuestion[row[Questions.id].value].orEmpty().map { it.first },
                correctAlternativeIndex = alternativesByQuestion[row[Questions.id].value]
                    .orEmpty()
                    .indexOfFirst { it.second },
            )
        }
    }

    override suspend fun create(request: CreateQuestionRequest): Question = dbQuery {
        val id = Questions.insert {
            it[text] = request.question
        } get Questions.id

        request.alternatives.forEachIndexed { position, alternative ->
            Alternatives.insert {
                it[questionId] = id
                it[Alternatives.position] = position
                it[text] = alternative
                it[correct] = position == request.correctAlternativeIndex
            }
        }

        Question(id.value, request.question, request.alternatives, request.correctAlternativeIndex)
    }

    private suspend fun <T> dbQuery(block: () -> T): T =
        withContext(Dispatchers.IO) { transaction(database) { block() } }
}
