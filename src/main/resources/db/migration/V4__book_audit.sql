ALTER TABLE books
    ADD COLUMN created_by VARCHAR(100);

CREATE TABLE book_audit_log (
    id          BIGSERIAL PRIMARY KEY,
    book_id     BIGINT       NOT NULL,
    title       VARCHAR(200) NOT NULL,
    action      VARCHAR(20)  NOT NULL,
    performed_by VARCHAR(100) NOT NULL,
    performed_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_book_audit_log_book_id ON book_audit_log (book_id);
CREATE INDEX idx_book_audit_log_performed_at ON book_audit_log (performed_at DESC);
