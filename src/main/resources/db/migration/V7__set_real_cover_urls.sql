-- Set stable real cover images for newly seeded books

UPDATE books
SET cover_url = 'https://upload.wikimedia.org/wikipedia/en/e/e9/First_Single_Volume_Edition_of_The_Lord_of_the_Rings.gif'
WHERE title = 'The Lord of the Rings' AND author = 'J.R.R. Tolkien';

UPDATE books
SET cover_url = 'https://upload.wikimedia.org/wikipedia/en/d/de/Dune-Frank_Herbert_%281965%29_First_edition.jpg'
WHERE title = 'Dune' AND author = 'Frank Herbert';

UPDATE books
SET cover_url = 'https://upload.wikimedia.org/wikipedia/en/2/28/Atomic_Habits_book_cover.jpg'
WHERE title = 'Atomic Habits' AND author = 'James Clear';

UPDATE books
SET cover_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/TheAlchemist.jpg/330px-TheAlchemist.jpg'
WHERE title = 'The Alchemist' AND author = 'Paulo Coelho';

UPDATE books
SET cover_url = 'https://upload.wikimedia.org/wikipedia/en/c/c1/Thinking%2C_Fast_and_Slow.jpg'
WHERE title = 'Thinking, Fast and Slow' AND author = 'Daniel Kahneman';
