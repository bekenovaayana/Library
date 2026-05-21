-- Seed 5 additional books with cover URLs

INSERT INTO books (title, author, category, status, cover_url)
SELECT
    'The Lord of the Rings',
    'J.R.R. Tolkien',
    'Fantasy',
    'AVAILABLE',
    'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE title = 'The Lord of the Rings' AND author = 'J.R.R. Tolkien'
);

INSERT INTO books (title, author, category, status, cover_url)
SELECT
    'Dune',
    'Frank Herbert',
    'Science Fiction',
    'AVAILABLE',
    'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE title = 'Dune' AND author = 'Frank Herbert'
);

INSERT INTO books (title, author, category, status, cover_url)
SELECT
    'Atomic Habits',
    'James Clear',
    'Self-Development',
    'AVAILABLE',
    'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE title = 'Atomic Habits' AND author = 'James Clear'
);

INSERT INTO books (title, author, category, status, cover_url)
SELECT
    'The Alchemist',
    'Paulo Coelho',
    'Fiction',
    'AVAILABLE',
    'https://covers.openlibrary.org/b/isbn/9780061122415-L.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE title = 'The Alchemist' AND author = 'Paulo Coelho'
);

INSERT INTO books (title, author, category, status, cover_url)
SELECT
    'Thinking, Fast and Slow',
    'Daniel Kahneman',
    'Psychology',
    'AVAILABLE',
    'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg'
WHERE NOT EXISTS (
    SELECT 1 FROM books WHERE title = 'Thinking, Fast and Slow' AND author = 'Daniel Kahneman'
);
