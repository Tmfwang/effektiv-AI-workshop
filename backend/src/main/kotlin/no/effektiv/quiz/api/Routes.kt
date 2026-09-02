package no.effektiv.quiz.api

import io.ktor.http.HttpStatusCode
import io.ktor.server.application.call
import io.ktor.server.request.receive
import io.ktor.server.response.respond
import io.ktor.server.routing.Route
import io.ktor.server.routing.get
import io.ktor.server.routing.post
import io.ktor.server.routing.route
import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.QuizResponse
import no.effektiv.quiz.service.QuestionService

fun Route.quizRoutes(service: QuestionService) {
    route("/api/v1") {
        get("/quiz") {
            call.respond(QuizResponse(service.quiz()))
        }
        post("/questions") {
            val request = call.receive<CreateQuestionRequest>()
            call.respond(HttpStatusCode.Created, service.create(request))
        }
    }
}
