package com.library.management.service;

import com.library.management.dto.response.AdminStatisticsResponse;
import com.library.management.dto.response.AdminUserResponse;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BorrowRecordStatus;
import com.library.management.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {

    Page<AdminUserResponse> getAllUsers(String search, Role role, Pageable pageable);

    Page<BorrowResponse> getAllBorrowRecords(String search, BorrowRecordStatus status, Pageable pageable);

    AdminStatisticsResponse getStatistics();
}
