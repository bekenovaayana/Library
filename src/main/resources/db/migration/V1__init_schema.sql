-- Library Management System — initial schema

CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(50)  NOT NULL,
    email      VARCHAR(100) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL,
    CONSTRAINT uk_users_username UNIQUE (username),
    CONSTRAINT uk_users_email UNIQUE (email)
);

CREATE TABLE books (
    id       BIGSERIAL PRIMARY KEY,
    title    VARCHAR(200) NOT NULL,
    author   VARCHAR(100) NOT NULL,
    category VARCHAR(50)  NOT NULL,
    status   VARCHAR(20)  NOT NULL
);

CREATE TABLE borrow_records (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT    NOT NULL,
    book_id     BIGINT    NOT NULL,
    borrow_date TIMESTAMP NOT NULL,
    return_date TIMESTAMP,
    CONSTRAINT fk_borrow_records_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_borrow_records_book FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE INDEX idx_books_status ON books (status);
CREATE INDEX idx_books_title ON books (title);
CREATE INDEX idx_borrow_records_user_id ON borrow_records (user_id);
CREATE INDEX idx_borrow_records_book_id ON borrow_records (book_id);
CREATE INDEX idx_borrow_records_return_date ON borrow_records (return_date);
