package com.library.management.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class SearchUtilsTest {

    @Test
    void likePattern_whenBlank_returnsMatchAll() {
        assertThat(SearchUtils.likePattern(null)).isEqualTo("%");
        assertThat(SearchUtils.likePattern("  ")).isEqualTo("%");
    }

    @Test
    void likePattern_whenValue_returnsLowercaseWrapped() {
        assertThat(SearchUtils.likePattern("Java")).isEqualTo("%java%");
    }

    @Test
    void prefixPattern_whenBlank_returnsMatchAll() {
        assertThat(SearchUtils.prefixPattern(null)).isEqualTo("%");
    }

    @Test
    void prefixPattern_whenValue_returnsLowercasePrefix() {
        assertThat(SearchUtils.prefixPattern("Prog")).isEqualTo("prog%");
    }
}
