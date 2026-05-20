package com.library.management.integration;

import com.library.management.entity.Book;
import com.library.management.entity.BookStatus;
import com.library.management.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles({"test", "test-postgres"})
@Testcontainers(disabledWithoutDocker = true)
@Tag("postgres")
@Transactional
class BookSearchPostgresIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine")
            .withDatabaseName("library_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void registerDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();
        bookRepository.save(Book.builder()
                .title("Effective Java")
                .author("Joshua Bloch")
                .category("Programming")
                .status(BookStatus.AVAILABLE)
                .build());
        bookRepository.save(Book.builder()
                .title("Clean Architecture")
                .author("Robert Martin")
                .category("Programming")
                .status(BookStatus.AVAILABLE)
                .build());
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchBooks_onPostgres_withLowercaseTitleFilter() throws Exception {
        mockMvc.perform(get("/books/search")
                        .param("title", "effective")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Effective Java"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void searchBooks_onPostgres_withUnifiedQuery() throws Exception {
        mockMvc.perform(get("/books/search")
                        .param("q", "architecture")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Clean Architecture"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getAllBooks_onPostgres_withPagination() throws Exception {
        mockMvc.perform(get("/books")
                        .param("page", "0")
                        .param("size", "1")
                        .param("sort", "title,asc")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.totalElements").value(2))
                .andExpect(jsonPath("$.totalPages").value(2));
    }

    @Test
    @WithMockUser(roles = "USER")
    void getCategories_onPostgres_withPrefix() throws Exception {
        mockMvc.perform(get("/books/categories")
                        .param("prefix", "prog")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0]").value("Programming"));
    }
}
