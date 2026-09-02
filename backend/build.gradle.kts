plugins {
    kotlin("jvm") version "2.2.20"
    kotlin("plugin.serialization") version "2.2.20"
    application
}

group = "no.effektiv"
version = "1.0.0"

repositories {
    mavenCentral()
}

val ktorVersion = "3.5.2"
val exposedVersion = "1.4.0"
val flywayVersion = "13.4.0"
val testcontainersVersion = "1.21.4"

dependencies {
    implementation("io.ktor:ktor-server-core:$ktorVersion")
    implementation("io.ktor:ktor-server-netty:$ktorVersion")
    implementation("io.ktor:ktor-server-content-negotiation:$ktorVersion")
    implementation("io.ktor:ktor-serialization-kotlinx-json:$ktorVersion")
    implementation("io.ktor:ktor-server-status-pages:$ktorVersion")

    implementation("org.jetbrains.exposed:exposed-core:$exposedVersion")
    implementation("org.jetbrains.exposed:exposed-jdbc:$exposedVersion")
    implementation("org.flywaydb:flyway-core:$flywayVersion")
    implementation("org.flywaydb:flyway-sqlserver:$flywayVersion")
    implementation("com.zaxxer:HikariCP:7.0.2")
    implementation("com.microsoft.sqlserver:mssql-jdbc:13.2.1.jre11")
    implementation("ch.qos.logback:logback-classic:1.5.18")

    testImplementation(kotlin("test"))
    testImplementation("io.ktor:ktor-server-test-host:$ktorVersion")
    testImplementation("io.ktor:ktor-client-content-negotiation:$ktorVersion")
    testImplementation("org.junit.jupiter:junit-jupiter-params:5.13.4")
    testImplementation("org.testcontainers:junit-jupiter:$testcontainersVersion")
    testImplementation("org.testcontainers:mssqlserver:$testcontainersVersion")
}

kotlin {
    jvmToolchain(21)
}

application {
    mainClass.set("no.effektiv.quiz.ApplicationKt")
}

tasks.test {
    useJUnitPlatform()
    testLogging {
        events("passed", "skipped", "failed")
    }
}
