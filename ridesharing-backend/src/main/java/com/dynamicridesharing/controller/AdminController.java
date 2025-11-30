package com.dynamicridesharing.controller;

import com.dynamicridesharing.dto.AdminDashboardSummaryDTO;
import com.dynamicridesharing.model.Dispute;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.model.Payment;
import com.dynamicridesharing.dto.AdminRideViewDTO; 
import com.dynamicridesharing.dto.AdminBookingViewDTO;
import com.dynamicridesharing.dto.AdminDisputeViewDTO;
import java.util.List;
import com.dynamicridesharing.dto.WeeklyReportDTO;
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')") // Secures all methods in this controller
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard/summary")
    public ResponseEntity<AdminDashboardSummaryDTO> getDashboardSummary() {
        return ResponseEntity.ok(adminService.getDashboardSummary());
    }

    @GetMapping("/users/drivers")
    public ResponseEntity<List<User>> getDrivers() {
        // IMPORTANT: In a real app, you would map this to a UserDTO to avoid exposing the password hash.
        List<User> drivers = adminService.getAllDrivers();
        return ResponseEntity.ok(drivers);
    }

    @GetMapping("/users/passengers")
    public ResponseEntity<List<User>> getPassengers() {
        List<User> passengers = adminService.getAllPassengers();
        return ResponseEntity.ok(passengers);
    }
    
    @GetMapping("/disputes")
    public ResponseEntity<List<AdminDisputeViewDTO>> getDisputes() {
        return ResponseEntity.ok(adminService.getAllDisputesWithDetails());
    }
    // --- Management Actions ---

    @PutMapping("/users/{userId}/block")
    public ResponseEntity<User> blockUser(@PathVariable Long userId) {
        // This now performs a real database update
        User blockedUser = adminService.blockUser(userId);
        return ResponseEntity.ok(blockedUser);
    }

    @PutMapping("/users/{userId}/unblock")
    public ResponseEntity<User> unblockUser(@PathVariable Long userId) {
        User unblockedUser = adminService.unblockUser(userId);
        return ResponseEntity.ok(unblockedUser);
    }

    @PutMapping("/disputes/{disputeId}/resolve")
    public ResponseEntity<Dispute> resolveDispute(@PathVariable Long disputeId) {
        Dispute resolvedDispute = adminService.resolveDispute(disputeId);
        return ResponseEntity.ok(resolvedDispute);
    }
    
      @GetMapping("/monitoring/rides")
    public ResponseEntity<List<AdminRideViewDTO>> getAllRides() {
        return ResponseEntity.ok(adminService.getAllRidesWithDetails());
    }
    
      @GetMapping("/monitoring/bookings")
    public ResponseEntity<List<AdminBookingViewDTO>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookingsWithDetails());
    }

    @GetMapping("/monitoring/payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(adminService.getAllPayments());
    }
    
    @GetMapping("/reports/weekly")
public ResponseEntity<List<WeeklyReportDTO>> getWeeklyReport() {
    return ResponseEntity.ok(adminService.getWeeklyReport());
}
}


