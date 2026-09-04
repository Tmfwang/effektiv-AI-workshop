CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    CONSTRAINT ck_questions_question_not_blank CHECK (length(trim(question)) BETWEEN 1 AND 500)
);

CREATE TABLE question_alternatives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    position INT NOT NULL,
    alternative TEXT NOT NULL,
    is_correct INTEGER NOT NULL CHECK (is_correct IN (0, 1)),
    CONSTRAINT fk_question_alternatives_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    CONSTRAINT uq_question_alternatives_position UNIQUE (question_id, position),
    CONSTRAINT ck_question_alternatives_position CHECK (position BETWEEN 0 AND 3),
    CONSTRAINT ck_question_alternatives_text_not_blank CHECK (length(trim(alternative)) BETWEEN 1 AND 200)
);

CREATE INDEX ix_question_alternatives_question_id ON question_alternatives(question_id);
CREATE UNIQUE INDEX ux_question_alternatives_one_correct
    ON question_alternatives(question_id)
    WHERE is_correct = 1;

INSERT INTO questions (question) VALUES
    ('Which Kotlin operator supplies a fallback value when the expression on its left is null?'),
    ('In a Next.js App Router project, which file convention normally defines the page rendered at the root `/` route?'),
    ('Which SQLite connection URL points to a file named quiz.db?'),
    ('Which SQLite declaration creates an integer primary key that automatically increments?'),
    ('What is the default name of the table Flyway uses to record applied migrations?'),
    ('Which HTTP status code most specifically indicates that a new resource was successfully created?'),
    ('Which country-code top-level domain is assigned to Norway?'),
    ('Which IANA time-zone identifier should an application normally use for Norwegian local time, including daylight-saving rules?'),
    ('What is the name of the shared login solution commonly used to access Norwegian public digital services?'),
    ('Which set contains the three additional letters found at the end of the Norwegian alphabet?');

INSERT INTO question_alternatives (question_id, position, alternative, is_correct) VALUES
    (1, 0, '?.', 0), (1, 1, '?:', 1), (1, 2, '!!', 0), (1, 3, '::', 0),
    (2, 0, 'app/index.tsx', 0), (2, 1, 'pages/page.tsx', 0), (2, 2, 'app/page.tsx', 1), (2, 3, 'src/root.tsx', 0),
    (3, 0, 'sqlite://quiz.db', 0), (3, 1, 'jdbc:sqlite:quiz.db', 1), (3, 2, 'jdbc:sqlite://localhost/quiz.db', 0), (3, 3, 'jdbc:sqlite:memory:quiz.db', 0),
    (4, 0, 'BIGINT AUTO_INCREMENT', 0), (4, 1, 'BIGSERIAL', 0), (4, 2, 'INTEGER PRIMARY KEY AUTOINCREMENT', 1), (4, 3, 'INTEGER SEQUENCE(1,1)', 0),
    (5, 0, 'flyway_schema_history', 1), (5, 1, 'schema_migrations', 0), (5, 2, 'flyway_migration_log', 0), (5, 3, 'database_version', 0),
    (6, 0, '200 OK', 0), (6, 1, '202 Accepted', 0), (6, 2, '204 No Content', 0), (6, 3, '201 Created', 1),
    (7, 0, '.nb', 0), (7, 1, '.no', 1), (7, 2, '.nor', 0), (7, 3, '.nv', 0),
    (8, 0, 'CET', 0), (8, 1, 'Norway/Local', 0), (8, 2, 'Europe/Oslo', 1), (8, 3, 'UTC+1', 0),
    (9, 0, 'ID-porten', 1), (9, 1, 'Altinn Studio', 0), (9, 2, 'BankAxept', 0), (9, 3, 'Digipost Connect', 0),
    (10, 0, 'Ä, Ö, Ü', 0), (10, 1, 'Æ, Ö, Å', 0), (10, 2, 'Ä, Ø, Å', 0), (10, 3, 'Æ, Ø, Å', 1);
