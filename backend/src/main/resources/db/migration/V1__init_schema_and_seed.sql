CREATE TABLE questions (
    id BIGINT IDENTITY(1, 1) NOT NULL,
    question NVARCHAR(500) NOT NULL,
    created_at DATETIME2(3) NOT NULL CONSTRAINT df_questions_created_at DEFAULT SYSUTCDATETIME(),
    CONSTRAINT pk_questions PRIMARY KEY (id),
    CONSTRAINT ck_questions_question_not_blank CHECK (LEN(LTRIM(RTRIM(question))) BETWEEN 1 AND 500)
);

CREATE TABLE question_alternatives (
    id BIGINT IDENTITY(1, 1) NOT NULL,
    question_id BIGINT NOT NULL,
    position INT NOT NULL,
    alternative NVARCHAR(200) NOT NULL,
    is_correct BIT NOT NULL,
    CONSTRAINT pk_question_alternatives PRIMARY KEY (id),
    CONSTRAINT fk_question_alternatives_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_alternatives_position UNIQUE (question_id, position),
    CONSTRAINT ck_question_alternatives_position CHECK (position BETWEEN 0 AND 3),
    CONSTRAINT ck_question_alternatives_text_not_blank CHECK (LEN(LTRIM(RTRIM(alternative))) BETWEEN 1 AND 200)
);

CREATE INDEX ix_question_alternatives_question_id ON question_alternatives(question_id);
CREATE UNIQUE INDEX ux_question_alternatives_one_correct
    ON question_alternatives(question_id)
    WHERE is_correct = 1;

INSERT INTO questions (question) VALUES
    (N'Which Kotlin operator supplies a fallback value when the expression on its left is null?'),
    (N'In a Next.js App Router project, which file convention normally defines the page rendered at the root `/` route?'),
    (N'If SQL Server runs in Docker with port `1433:1433` while Ktor runs directly on the host, which address should Ktor normally use to reach SQL Server?'),
    (N'Which SQL Server declaration creates a 64-bit integer column that automatically starts at 1 and increments by 1?'),
    (N'What is the default name of the table Flyway uses to record applied migrations?'),
    (N'Which HTTP status code most specifically indicates that a new resource was successfully created?'),
    (N'Which country-code top-level domain is assigned to Norway?'),
    (N'Which IANA time-zone identifier should an application normally use for Norwegian local time, including daylight-saving rules?'),
    (N'What is the name of the shared login solution commonly used to access Norwegian public digital services?'),
    (N'Which set contains the three additional letters found at the end of the Norwegian alphabet?');

INSERT INTO question_alternatives (question_id, position, alternative, is_correct) VALUES
    (1, 0, N'?.', 0), (1, 1, N'?:', 1), (1, 2, N'!!', 0), (1, 3, N'::', 0),
    (2, 0, N'app/index.tsx', 0), (2, 1, N'pages/page.tsx', 0), (2, 2, N'app/page.tsx', 1), (2, 3, N'src/root.tsx', 0),
    (3, 0, N'db:1433', 0), (3, 1, N'localhost:1433', 1), (3, 2, N'mssql:8080', 0), (3, 3, N'host.docker.internal:3000', 0),
    (4, 0, N'BIGINT AUTO_INCREMENT', 0), (4, 1, N'BIGSERIAL', 0), (4, 2, N'BIGINT IDENTITY(1,1)', 1), (4, 3, N'BIGINT SEQUENCE(1,1)', 0),
    (5, 0, N'flyway_schema_history', 1), (5, 1, N'schema_migrations', 0), (5, 2, N'flyway_migration_log', 0), (5, 3, N'database_version', 0),
    (6, 0, N'200 OK', 0), (6, 1, N'202 Accepted', 0), (6, 2, N'204 No Content', 0), (6, 3, N'201 Created', 1),
    (7, 0, N'.nb', 0), (7, 1, N'.no', 1), (7, 2, N'.nor', 0), (7, 3, N'.nv', 0),
    (8, 0, N'CET', 0), (8, 1, N'Norway/Local', 0), (8, 2, N'Europe/Oslo', 1), (8, 3, N'UTC+1', 0),
    (9, 0, N'ID-porten', 1), (9, 1, N'Altinn Studio', 0), (9, 2, N'BankAxept', 0), (9, 3, N'Digipost Connect', 0),
    (10, 0, N'Ä, Ö, Ü', 0), (10, 1, N'Æ, Ö, Å', 0), (10, 2, N'Ä, Ø, Å', 0), (10, 3, N'Æ, Ø, Å', 1);
