package no.effektiv.quiz

import io.ktor.client.call.body
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation as ClientContentNegotiation
import io.ktor.client.request.get
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.kotlinx.json.json
import io.ktor.server.testing.testApplication
import kotlinx.serialization.json.Json
import no.effektiv.quiz.config.DatabaseConfig
import no.effektiv.quiz.config.DatabaseFactory
import no.effektiv.quiz.config.DatabaseResources
import no.effektiv.quiz.domain.CreateQuestionRequest
import no.effektiv.quiz.domain.ErrorResponse
import no.effektiv.quiz.domain.Question
import no.effektiv.quiz.domain.QuizResponse
import no.effektiv.quiz.service.QuestionSelector
import org.flywaydb.core.Flyway
import org.junit.jupiter.api.Test
import org.testcontainers.containers.MSSQLServerContainer
import org.testcontainers.junit.jupiter.Container
import org.testcontainers.junit.jupiter.Testcontainers
import org.testcontainers.utility.DockerImageName
import kotlin.test.assertEquals
import kotlin.test.assertFalse
import kotlin.test.assertTrue

@Testcontainers(disabledWithoutDocker = true)
class QuizApiIntegrationTest {
    @Test
    fun `GET quiz returns the ten migrated Unicode seed questions`() = withFreshDatabase { resources ->
        testApplication {
            application { module(resources, QuestionSelector { questions, count -> questions.take(count) }) }
            val client = jsonClient()

            val response = client.get("/api/v1/quiz")
            val quiz = response.body<QuizResponse>()

            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(10, quiz.questions.size)
            assertEquals(10, quiz.questions.map { it.id }.distinct().size)
            assertEquals("Which set contains the three additional letters found at the end of the Norwegian alphabet?", quiz.questions[9].question)
            assertEquals("Æ, Ø, Å", quiz.questions[9].alternatives[3])
            assertEquals(listOf(1, 2, 1, 2, 0, 3, 1, 2, 0, 3), quiz.questions.map { it.correctAlternativeIndex })
            assertTrue(quiz.questions.all { it.alternatives.size == 4 })
        }
    }

    @Test
    fun `POST creates a Unicode question which deterministic selection can return`() = withFreshDatabase { resources ->
        testApplication {
            application {
                module(resources, QuestionSelector { questions, count -> questions.sortedByDescending { it.id }.take(count) })
            }
            val client = jsonClient()
            val request = CreateQuestionRequest(
                question = "Hva betyr déjà vu?",
                alternatives = listOf("Allerede sett", "God dag", "Takk", "På gjensyn"),
                correctAlternativeIndex = 0,
            )

            val createResponse = client.post("/api/v1/questions") {
                contentType(ContentType.Application.Json)
                setBody(request)
            }
            val created = createResponse.body<Question>()
            val quiz = client.get("/api/v1/quiz").body<QuizResponse>()

            assertEquals(HttpStatusCode.Created, createResponse.status)
            assertTrue(created.id > 10)
            assertEquals(request.question, created.question)
            assertEquals(request.alternatives, created.alternatives)
            assertTrue(quiz.questions.any { it.id == created.id })
            assertFalse(quiz.questions.any { it.id == 1L })
        }
    }

    @Test
    fun `POST returns all semantic validation errors`() = withFreshDatabase { resources ->
        testApplication {
            application { module(resources) }
            val client = jsonClient()

            val response = client.post("/api/v1/questions") {
                contentType(ContentType.Application.Json)
                setBody(CreateQuestionRequest(" ", listOf("", "B", "C"), 9))
            }
            val error = response.body<ErrorResponse>()

            assertEquals(HttpStatusCode.BadRequest, response.status)
            assertEquals("VALIDATION_ERROR", error.code)
            assertEquals(
                listOf("question", "alternatives", "alternatives[0]", "correctAlternativeIndex"),
                error.details?.map { it.field },
            )
        }
    }

    @Test
    fun `POST rejects normalized duplicates and length violations`() = withFreshDatabase { resources ->
        testApplication {
            application { module(resources) }
            val client = jsonClient()
            val cases = listOf(
                CreateQuestionRequest("Question?", listOf("Same", " same ", "Other", "Last"), 0) to "alternatives",
                CreateQuestionRequest("q".repeat(501), listOf("A", "B", "C", "D"), 0) to "question",
                CreateQuestionRequest("Question?", listOf("a".repeat(201), "B", "C", "D"), 0) to "alternatives[0]",
            )

            cases.forEach { (request, expectedField) ->
                val response = client.post("/api/v1/questions") {
                    contentType(ContentType.Application.Json)
                    setBody(request)
                }

                assertEquals(HttpStatusCode.BadRequest, response.status)
                assertTrue(response.body<ErrorResponse>().details.orEmpty().any { it.field == expectedField })
            }
        }
    }

    @Test
    fun `POST rejects malformed JSON missing fields and unknown properties`() = withFreshDatabase { resources ->
        testApplication {
            application { module(resources) }
            val client = jsonClient()
            val bodies = listOf(
                "{not-json}",
                """{"question":"Missing fields"}""",
                """{"question":"Q","alternatives":["A","B","C","D"],"correctAlternativeIndex":0,"extra":true}""",
            )

            bodies.forEach { body ->
                val response = client.post("/api/v1/questions") {
                    contentType(ContentType.Application.Json)
                    setBody(body)
                }
                assertEquals(HttpStatusCode.BadRequest, response.status)
                assertEquals("INVALID_REQUEST", response.body<ErrorResponse>().code)
            }
        }
    }

    @Test
    fun `GET quiz reports deterministic insufficient bank behavior`() = withFreshDatabase { resources ->
        resources.dataSource.connection.use { connection ->
            connection.createStatement().use { it.executeUpdate("DELETE FROM questions WHERE id = 10") }
        }

        testApplication {
            application { module(resources) }
            val client = jsonClient()

            val response = client.get("/api/v1/quiz")
            val error = response.body<ErrorResponse>()

            assertEquals(HttpStatusCode.Conflict, response.status)
            assertEquals("INSUFFICIENT_QUESTIONS", error.code)
            assertTrue(error.message.contains("only 9"))
        }
    }

    private fun io.ktor.server.testing.ApplicationTestBuilder.jsonClient() = createClient {
        install(ClientContentNegotiation) {
            json(Json { explicitNulls = false })
        }
    }

    private fun withFreshDatabase(test: (DatabaseResources) -> Unit) {
        val resources = DatabaseFactory.create(databaseConfig())
        Flyway.configure()
            .dataSource(resources.dataSource)
            .cleanDisabled(false)
            .load()
            .run {
                clean()
                migrate()
            }
        try {
            test(resources)
        } finally {
            if (!resources.dataSource.isClosed) resources.close()
        }
    }

    private fun databaseConfig() = DatabaseConfig(
        host = sqlServer.host,
        port = sqlServer.getMappedPort(1433),
        username = sqlServer.username,
        password = sqlServer.password,
    )

    companion object {
        @Container
        @JvmStatic
        val sqlServer: MSSQLServerContainer<*> = MSSQLServerContainer(
            DockerImageName.parse("mcr.microsoft.com/mssql/server:2022-CU21-ubuntu-22.04"),
        ).acceptLicense()
    }
}
