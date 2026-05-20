package com.library.management.service;

import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BorrowService {

    BorrowResponse borrowBook(BorrowRequest request);

    BorrowResponse returnBook(Long borrowId);

    Page<BorrowResponse> getMyBorrows(Pageable pageable);
}
