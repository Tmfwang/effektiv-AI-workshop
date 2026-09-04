package no.effektiv.quiz.config

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.v1.jdbc.Database
import java.io.File

data class DatabaseConfig(
    val path: String = DEFAULT_PATH,
) {
    init {
        require(path.isNotBlank()) { "DB_PATH must not be blank" }
    }

    companion object {
        const val DEFAULT_PATH = "data/quiz.db"

        fun fromEnvironment(environment: Map<String, String> = System.getenv()) = DatabaseConfig(
            path = environment["DB_PATH"]?.takeIf { it.isNotBlank() } ?: DEFAULT_PATH,
        )
    }
}

data class DatabaseResources(
    val dataSource: HikariDataSource,
    val database: Database,
) : AutoCloseable {
    override fun close() = dataSource.close()
}

object DatabaseFactory {
    fun create(config: DatabaseConfig): DatabaseResources {
        File(config.path).absoluteFile.parentFile?.mkdirs()

        val hikari = HikariDataSource(HikariConfig().apply {
            poolName = "quiz-app-pool"
            maximumPoolSize = 1
            minimumIdle = 1
            connectionTimeout = 10_000
            jdbcUrl = "jdbc:sqlite:${config.path}"
            driverClassName = "org.sqlite.JDBC"
            connectionInitSql = "PRAGMA foreign_keys = ON"
        })

        try {
            Flyway.configure()
                .dataSource(hikari)
                .locations("classpath:db/migration")
                .load()
                .migrate()
            return DatabaseResources(hikari, Database.connect(hikari))
        } catch (exception: Exception) {
            hikari.close()
            throw exception
        }
    }
}
