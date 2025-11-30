// src/main/java/com/dynamicridesharing/controller/BookingController.java
package com.dynamicridesharing.controller;

import com.dynamicridesharing.dto.BookRideRequest;
import com.dynamicridesharing.dto.BookRideResponse;
import com.dynamicridesharing.dto.BookingDetailDTO;
import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.service.BookingService;
import com.dynamicridesharing.service.NotificationService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;
    private final NotificationService notificationService;

    public BookingController(BookingService bookingService, NotificationService notificationService) {
        this.bookingService = bookingService;
        this.notificationService = notificationService;
    }

    // 🔹 Normal booking (no confirmation required)
    @PostMapping("/book")
    @PreAuthorize("hasAuthority('ROLE_PASSENGER')")
    public BookRideResponse book(Principal principal, @RequestBody BookRideRequest req) {
        return bookingService.bookRide(principal.getName(), req.getRideId(), req.getSeatsBooked(), req.getTotalFare() );
    }

    // 🔹 Request booking (for rides with requiredConfirmation=true)
    @PostMapping("/request")
    @PreAuthorize("hasAuthority('ROLE_PASSENGER')")
    public BookRideResponse requestBooking(Principal principal, @RequestBody BookRideRequest req) {
        return bookingService.requestBooking(principal.getName(), req.getRideId(), req.getSeatsBooked(),req.getTotalFare());
    }

    // 🔹 Driver approves booking
    @PatchMapping("/{bookingId}/approve")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public BookRideResponse approve(@PathVariable Long bookingId, Principal principal) {
        return bookingService.approveBooking(bookingId, principal.getName());
    }

    // 🔹 Driver rejects booking
    @PatchMapping("/{bookingId}/reject")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public BookRideResponse reject(@PathVariable Long bookingId, Principal principal) {
        return bookingService.rejectBooking(bookingId, principal.getName());
    }

    @GetMapping("/me")
	@PreAuthorize("hasAuthority('ROLE_PASSENGER')")
	public ResponseEntity<List<BookingDetailDTO>> myBookings(Principal principal) {
	    // It now calls the new service method and returns the clean DTO list
	    List<BookingDetailDTO> bookingsWithDetails = bookingService.getPassengerBookingsWithDetails(principal.getName());
	    return ResponseEntity.ok(bookingsWithDetails);
	}

    @GetMapping("/driver")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public List<Booking> driverBookings(Principal principal) {
        return bookingService.driverBookings(principal.getName());
    }
    
     @DeleteMapping("/{bookingId}/cancel")
    @PreAuthorize("hasAuthority('ROLE_PASSENGER')")
    public ResponseEntity<Void> cancelMyBooking(@PathVariable Long bookingId, Principal principal) {
        bookingService.cancelBooking(bookingId, principal.getName());
        return ResponseEntity.noContent().build(); // 204 No Content is a good response for a successful deletion/cancellation
    }
}
