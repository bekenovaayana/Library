-- Replace unreachable external cover URLs with stable placeholders

UPDATE books
SET cover_url = 'https://placehold.co/240x360/f5f3ff/4c1d95?text=The+Lord+of+the+Rings'
WHERE title = 'The Lord of the Rings' AND author = 'J.R.R. Tolkien';

UPDATE books
SET cover_url = 'https://placehold.co/240x360/ede9fe/5b21b6?text=Dune'
WHERE title = 'Dune' AND author = 'Frank Herbert';

UPDATE books
SET cover_url = 'https://placehold.co/240x360/e9d5ff/4c1d95?text=Atomic+Habits'
WHERE title = 'Atomic Habits' AND author = 'James Clear';

UPDATE books
SET cover_url = 'https://placehold.co/240x360/f3e8ff/6d28d9?text=The+Alchemist'
WHERE title = 'The Alchemist' AND author = 'Paulo Coelho';

UPDATE books
SET cover_url = 'https://placehold.co/240x360/dbeafe/1e3a8a?text=Thinking+Fast+and+Slow'
WHERE title = 'Thinking, Fast and Slow' AND author = 'Daniel Kahneman';
