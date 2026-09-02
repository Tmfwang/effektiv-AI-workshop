package no.effektiv.quiz.domain

import kotlinx.serialization.Serializable

@Serializable
data class Question(
    val id: Long,
    val question: String,
    val alternatives: List<String>,
    val correctAlternativeIndex: Int,
)

@Serializable
data class QuizResponse(val questions: List<Question>)

@Serializable
data class CreateQuestionRequest(
    val question: String,
    val alternatives: List<String>,
    val correctAlternativeIndex: Int,
)

@Serializable
data class FieldError(val field: String, val message: String)

@Serializable
data class ErrorResponse(
    val code: String,
    val message: String,
    val details: List<FieldError>? = null,
)
