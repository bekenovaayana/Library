package com.library.management.integration;

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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class BookPaginationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
        bookRepository.save(Book.builder()
                .title("Book A")
                .author("Author")
                .category("Fiction")
                .status(BookStatus.AVAILABLE)
                .build());
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllBooks_withInvalidSort_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/books")
                        .param("sort", "password,asc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchBooks_withInvalidSort_shouldReturnBadRequest() throws Exception {
        mockMvc.perform(get("/books/search")
                        .param("sort", "unknownField,desc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }
}
