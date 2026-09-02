package no.effektiv.quiz.config

import com.microsoft.sqlserver.jdbc.SQLServerDataSource
import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import org.jetbrains.exposed.v1.jdbc.Database

data class DatabaseConfig(
    val host: String,
    val port: Int,
    val username: String,
    val password: String,
    val database: String = DATABASE_NAME,
) {
    init {
        require(database == DATABASE_NAME) { "Only the fixed database name '$DATABASE_NAME' is supported" }
        require(port in 1..65535) { "DB_PORT must be between 1 and 65535" }
    }

    companion object {
        const val DATABASE_NAME = "quiz_app"

        fun fromEnvironment(environment: Map<String, String> = System.getenv()) = DatabaseConfig(
            host = environment["DB_HOST"] ?: "localhost",
            port = environment["DB_PORT"]?.toIntOrNull() ?: 1433,
            username = environment["DB_USER"] ?: "sa",
            password = environment["DB_PASSWORD"] ?: "LocalQuiz_Passw0rd!",
            database = environment["DB_NAME"] ?: DATABASE_NAME,
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
    private const val CREATE_DATABASE_SQL =
        "IF DB_ID(N'quiz_app') IS NULL CREATE DATABASE [quiz_app]"

    fun create(config: DatabaseConfig): DatabaseResources {
        bootstrap(config)

        val hikari = HikariDataSource(HikariConfig().apply {
            poolName = "quiz-app-pool"
            maximumPoolSize = 10
            minimumIdle = 1
            connectionTimeout = 10_000
            dataSourceClassName = SQLServerDataSource::class.java.name
            addDataSourceProperty("serverName", config.host)
            addDataSourceProperty("portNumber", config.port)
            addDataSourceProperty("databaseName", DatabaseConfig.DATABASE_NAME)
            addDataSourceProperty("user", config.username)
            addDataSourceProperty("password", config.password)
            addDataSourceProperty("encrypt", true)
            addDataSourceProperty("trustServerCertificate", true)
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

    fun bootstrap(config: DatabaseConfig) {
        val master = sqlServerDataSource(config, "master")
        master.connection.use { connection ->
            connection.createStatement().use { statement -> statement.executeUpdate(CREATE_DATABASE_SQL) }
        }
    }

    private fun sqlServerDataSource(config: DatabaseConfig, database: String) = SQLServerDataSource().apply {
        setServerName(config.host)
        setPortNumber(config.port)
        setDatabaseName(database)
        setUser(config.username)
        setPassword(config.password)
        setEncrypt("true")
        setTrustServerCertificate(true)
    }
}
