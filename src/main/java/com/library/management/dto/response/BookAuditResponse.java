package com.library.management.dto.response;

import com.library.management.entity.BookAuditAction;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookAuditResponse {

    private Long id;
    private Long bookId;
    private String title;
    private BookAuditAction action;
    private String performedBy;
    private LocalDateTime performedAt;
}
