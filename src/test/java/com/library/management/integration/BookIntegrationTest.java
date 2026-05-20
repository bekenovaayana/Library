package com.library.management.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.management.dto.request.BookRequest;
import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookRepository bookRepository;

    private Book existingBook;

    @BeforeEach
    void setUp() {
        existingBook = bookRepository.save(Book.builder()
                .title("Effective Java")
                .author("Joshua Bloch")
                .category("Programming")
                .status(BookStatus.AVAILABLE)
                .build());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllBooks_whenAuthenticated_shouldReturnOk() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/books")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Effective Java"));
    }

    @Test
    void getAllBooks_whenUnauthenticated_shouldReturnUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/books")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getBookById_whenBookExists_shouldReturnOk() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/books/{id}", existingBook.getId())
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Effective Java"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getBookById_whenBookNotFound_shouldReturnNotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/books/{id}", 99999L)
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchBooks_byTitle_shouldReturnMatchingBooks() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/books/search")
                        .param("title", "effective")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Effective Java"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void createBook_whenAdmin_shouldReturnCreated() throws Exception {
        // Arrange
        BookRequest request = BookRequest.builder()
                .title("Clean Code")
                .author("Robert Martin")
                .category("Programming")
                .build();

        // Act & Assert
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Clean Code"))
                .andExpect(jsonPath("$.status").value("AVAILABLE"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void createBook_whenUser_shouldReturnForbidden() throws Exception {
        // Arrange
        BookRequest request = BookRequest.builder()
                .title("Forbidden Book")
                .author("Author")
                .category("Category")
                .build();

        // Act & Assert
        mockMvc.perform(post("/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void updateBook_whenAdmin_shouldReturnOk() throws Exception {
        // Arrange
        BookRequest request = BookRequest.builder()
                .title("Effective Java 3rd Edition")
                .author("Joshua Bloch")
                .category("Programming")
                .build();

        // Act & Assert
        mockMvc.perform(put("/books/{id}", existingBook.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Effective Java 3rd Edition"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteBook_whenBookIsBorrowed_shouldReturnConflict() throws Exception {
        // Arrange
        existingBook.setStatus(BookStatus.BORROWED);
        bookRepository.save(existingBook);

        // Act & Assert
        mockMvc.perform(delete("/books/{id}", existingBook.getId()))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deleteBook_whenBookIsAvailable_shouldReturnNoContent() throws Exception {
        // Act & Assert
        mockMvc.perform(delete("/books/{id}", existingBook.getId()))
                .andExpect(status().isNoContent());
    }
}
