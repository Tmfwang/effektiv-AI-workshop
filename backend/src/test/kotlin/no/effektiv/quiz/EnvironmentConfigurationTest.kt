package no.effektiv.quiz

import no.effektiv.quiz.config.DatabaseConfig
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class EnvironmentConfigurationTest {
    @Test
    fun `uses values supplied by the local env loader`() {
        val config = DatabaseConfig.fromEnvironment(
            mapOf(
                "DB_HOST" to "db.example.test",
                "DB_PORT" to "11433",
                "DB_USER" to "local-user",
                "DB_PASSWORD" to "local-password",
                "DB_NAME" to "quiz_app",
            ),
        )

        assertEquals("db.example.test", config.host)
        assertEquals(11433, config.port)
        assertEquals("local-user", config.username)
        assertEquals("local-password", config.password)
        assertEquals("quiz_app", config.database)
    }
}
