package com.library.management.config;

import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
public class LibraryDataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(LibraryDataInitializer.class);

    private final BookRepository bookRepository;

    public LibraryDataInitializer(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() > 0) {
            return;
        }

        log.info("Seeding sample books into empty catalog");

        bookRepository.saveAll(java.util.List.of(
                book("Clean Code", "Robert C. Martin", "Programming"),
                book("Effective Java", "Joshua Bloch", "Programming"),
                book("The Pragmatic Programmer", "David Thomas", "Programming"),
                book("Design Patterns", "Erich Gamma", "Programming"),
                book("Introduction to Algorithms", "Thomas H. Cormen", "Computer Science"),
                book("Database System Concepts", "Abraham Silberschatz", "Computer Science"),
                book("1984", "George Orwell", "Fiction"),
                book("To Kill a Mockingbird", "Harper Lee", "Fiction"),
                book("Sapiens", "Yuval Noah Harari", "History"),
                book("A Brief History of Time", "Stephen Hawking", "Science")
        ));
    }

    private static Book book(String title, String author, String category) {
        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setCategory(category);
        book.setStatus(BookStatus.AVAILABLE);
        book.setCoverUrl(
                "https://placehold.co/240x360/e2e8f0/334155?text=" + title.replace(' ', '+')
        );
        return book;
    }
}
