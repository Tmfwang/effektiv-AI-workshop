package no.effektiv.quiz.repository

import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.Question

interface QuestionRepository {
    suspend fun findAll(): List<Question>
    suspend fun create(request: CreateQuestionRequest): Question
}
