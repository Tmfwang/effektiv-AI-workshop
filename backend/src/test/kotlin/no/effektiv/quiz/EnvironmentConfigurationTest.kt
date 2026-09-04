package no.effektiv.quiz

import no.effektiv.quiz.config.DatabaseConfig
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class EnvironmentConfigurationTest {
    @Test
    fun `uses values supplied by the local env loader`() {
        val config = DatabaseConfig.fromEnvironment(
            mapOf(
                "DB_PATH" to "data/test.db",
            ),
        )

        assertEquals("data/test.db", config.path)
    }
}
