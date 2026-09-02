package no.effektiv.quiz

import io.ktor.http.HttpStatusCode
import io.ktor.serialization.JsonConvertException
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationStopped
import io.ktor.server.application.install
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.server.plugins.BadRequestException
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.plugins.statuspages.StatusPages
import io.ktor.server.plugins.statuspages.exception
import io.ktor.server.response.respond
import io.ktor.server.routing.routing
import kotlinx.serialization.SerializationException
import kotlinx.serialization.json.Json
import no.effektiv.quiz.api.quizRoutes
import no.effektiv.quiz.config.DatabaseConfig
import no.effektiv.quiz.config.DatabaseFactory
import no.effektiv.quiz.config.DatabaseResources
import no.effektiv.quiz.domain.ErrorResponse
import no.effektiv.quiz.repository.ExposedQuestionRepository
import no.effektiv.quiz.service.InsufficientQuestionsException
import no.effektiv.quiz.service.QuestionSelector
import no.effektiv.quiz.service.QuestionService
import no.effektiv.quiz.service.RandomQuestionSelector
import no.effektiv.quiz.service.ValidationException
import org.slf4j.LoggerFactory

private val logger = LoggerFactory.getLogger("QuizApplication")

fun main() {
    val port = System.getenv("KTOR_PORT")?.toIntOrNull() ?: 8080
    val resources = DatabaseFactory.create(DatabaseConfig.fromEnvironment())
    embeddedServer(Netty, port = port) { module(resources) }.start(wait = true)
}

fun Application.module(
    resources: DatabaseResources,
    selector: QuestionSelector = RandomQuestionSelector(),
) {
    monitor.subscribe(ApplicationStopped) { resources.close() }

    install(ContentNegotiation) {
        json(Json {
            ignoreUnknownKeys = false
            explicitNulls = false
        })
    }
    install(StatusPages) {
        exception<ValidationException> { call, cause ->
            call.respond(
                HttpStatusCode.BadRequest,
                ErrorResponse("VALIDATION_ERROR", "Request validation failed", cause.errors),
            )
        }
        exception<InsufficientQuestionsException> { call, cause ->
            call.respond(
                HttpStatusCode.Conflict,
                ErrorResponse("INSUFFICIENT_QUESTIONS", cause.message ?: "Not enough questions"),
            )
        }
        exception<JsonConvertException> { call, _ -> invalidRequest(call) }
        exception<SerializationException> { call, _ -> invalidRequest(call) }
        exception<BadRequestException> { call, _ -> invalidRequest(call) }
        exception<Throwable> { call, cause ->
            logger.error("Unhandled request failure", cause)
            call.respond(
                HttpStatusCode.InternalServerError,
                ErrorResponse("INTERNAL_ERROR", "An unexpected server error occurred"),
            )
        }
    }

    val service = QuestionService(ExposedQuestionRepository(resources.database), selector)
    routing { quizRoutes(service) }
}

private suspend fun invalidRequest(call: io.ktor.server.application.ApplicationCall) {
    call.respond(
        HttpStatusCode.BadRequest,
        ErrorResponse("INVALID_REQUEST", "Request body is not valid JSON for this operation"),
    )
}
