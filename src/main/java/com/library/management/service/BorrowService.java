package com.library.management.service;

import com.library.management.dto.request.BorrowRequest;
import com.library.management.dto.response.BorrowResponse;

import java.util.List;

public interface BorrowService {

    BorrowResponse borrowBook(BorrowRequest request);

    BorrowResponse returnBook(Long borrowId);

    List<BorrowResponse> getMyBorrows();
}
