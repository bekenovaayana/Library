package com.library.management.controller;

import com.library.management.config.OpenApiConfig;
import com.library.management.dto.response.AdminStatisticsResponse;
import com.library.management.dto.response.AdminUserResponse;
import com.library.management.dto.response.BorrowResponse;
import com.library.management.entity.BorrowRecordStatus;
import com.library.management.entity.Role;
import com.library.management.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.library.management.dto.request.UpdateUserRoleRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin", description = "Admin panel endpoints")
@SecurityRequirement(name = OpenApiConfig.BEARER_SCHEME)
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users", description = "Returns paginated list of users without passwords")
    @ApiResponse(responseCode = "200", description = "Users retrieved")
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role role,
            @PageableDefault(size = 10, sort = "username", direction = Sort.Direction.ASC) Pageable pageable
    ) {
        return ResponseEntity.ok(adminService.getAllUsers(search, role, pageable));
    }

    @GetMapping("/borrowed-books")
    @Operation(summary = "Get all borrow records", description = "Returns paginated list of all borrow records")
    @ApiResponse(responseCode = "200", description = "Borrow records retrieved")
    public ResponseEntity<Page<BorrowResponse>> getAllBorrowRecords(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) BorrowRecordStatus status,
            @PageableDefault(size = 10, sort = "borrowDate", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(adminService.getAllBorrowRecords(search, status, pageable));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get system statistics", description = "Returns counts of users and books")
    @ApiResponse(responseCode = "200", description = "Statistics retrieved")
    public ResponseEntity<AdminStatisticsResponse> getStatistics() {
        return ResponseEntity.ok(adminService.getStatistics());
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Promote or demote user role")
    public ResponseEntity<AdminUserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRoleRequest request
    ) {
        return ResponseEntity.ok(adminService.updateUserRole(id, request.getRole()));
    }
}
