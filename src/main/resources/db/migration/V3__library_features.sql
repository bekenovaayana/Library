-- Due dates, fines, covers, reservations

ALTER TABLE books
    ADD COLUMN cover_url VARCHAR(500);

ALTER TABLE borrow_records
    ADD COLUMN due_date TIMESTAMP,
    ADD COLUMN fine_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN reminder_sent BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE borrow_records
SET due_date = borrow_date + INTERVAL '14 days'
WHERE due_date IS NULL;

ALTER TABLE borrow_records
    ALTER COLUMN due_date SET NOT NULL;

CREATE TABLE book_reservations (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT    NOT NULL,
    book_id    BIGINT    NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notified   BOOLEAN   NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_reservations_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_reservations_book FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
    CONSTRAINT uk_reservations_user_book UNIQUE (user_id, book_id)
);

CREATE INDEX idx_reservations_book_id ON book_reservations (book_id);
CREATE INDEX idx_reservations_user_id ON book_reservations (user_id);
CREATE INDEX idx_borrow_records_due_date ON borrow_records (due_date);
