package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.AdminDashboardSummaryDTO;
import com.dynamicridesharing.model.Dispute;
import com.dynamicridesharing.model.DisputeStatus;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.DisputeRepository;
import com.dynamicridesharing.repository.PaymentRepository;
import com.dynamicridesharing.repository.RideRepository;
import com.dynamicridesharing.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.model.Payment;
import com.dynamicridesharing.repository.BookingRepository; 
import com.dynamicridesharing.dto.AdminRideViewDTO; // <-- ADD THIS IMPORT
import org.springframework.transaction.annotation.Transactional; // <-- ADD THIS IMPORT
import java.util.stream.Collectors;
import com.dynamicridesharing.dto.AdminBookingViewDTO;
import com.dynamicridesharing.dto.AdminDisputeViewDTO;
import com.dynamicridesharing.dto.WeeklyReportDTO;
import com.dynamicridesharing.dto.DailyStat; // <-- ADD THIS LINE
import com.dynamicridesharing.dto.DailyStatDouble;

import java.math.BigDecimal; // <-- Add this import for safe conversion
import java.sql.Date;  
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import java.util.stream.IntStream;


import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final PaymentRepository paymentRepository;
    private final DisputeRepository disputeRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository, RideRepository rideRepository, PaymentRepository paymentRepository, DisputeRepository disputeRepository, BookingRepository bookingRepository ) {
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.paymentRepository = paymentRepository;
        this.disputeRepository = disputeRepository;
        this.bookingRepository =  bookingRepository;
    }

    /**
     * Gathers key metrics for the admin dashboard summary.
     */
    public AdminDashboardSummaryDTO getDashboardSummary() {
        long totalUsers = userRepository.count();
        long totalRides = rideRepository.count();
        Double totalPlatformEarnings = paymentRepository.sumPlatformFee().orElse(0.0);
        long openDisputes = disputeRepository.countByStatus(DisputeStatus.OPEN);
	
	  Double totalDriverEarnings = this.getTotalDriverEarnings();
	  
        return new AdminDashboardSummaryDTO(totalUsers, totalRides, totalPlatformEarnings, openDisputes,totalDriverEarnings);
    }

    /**
     * Retrieves all users with the role of "ROLE_DRIVER".
     */
    public List<User> getAllDrivers() {
        return userRepository.findByRole("ROLE_DRIVER");
    }

    /**
     * Retrieves all users with the role of "ROLE_PASSENGER".
     */
    public List<User> getAllPassengers() {
        return userRepository.findByRole("ROLE_PASSENGER");
    }

    /**
     * Retrieves a list of all disputes filed in the system.
     */
      @Transactional(readOnly = true)
    public List<AdminDisputeViewDTO> getAllDisputesWithDetails() {
        List<Dispute> disputes = disputeRepository.findAll();
        
        return disputes.stream().map(dispute -> {
            AdminDisputeViewDTO dto = new AdminDisputeViewDTO();
            dto.setId(dispute.getId());
            dto.setReason(dispute.getReason());
            dto.setStatus(dispute.getStatus());
            dto.setCreatedAt(dispute.getCreatedAt());

            // Safely access lazy-loaded data within the transaction
            if (dispute.getBooking() != null) {
                dto.setBookingId(dispute.getBooking().getId());
            }
            if (dispute.getReportingUser() != null) {
                dto.setReportingUserName(dispute.getReportingUser().getName());
                dto.setReportingUserEmail(dispute.getReportingUser().getEmail());
            }
            return dto;
        }).collect(Collectors.toList());
    }
    
    /**
     * Blocks a user, preventing them from logging in or using the service.
     * (Note: Requires adding an 'isBlocked' field to the User entity).
     */
     public User blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setEnabled(false); // Set the flag to false
        
        return userRepository.save(user); // Save the updated user to the database
    }
    
    /**
     * Unblocks a user by setting their 'enabled' flag to true.
     */
    public User unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        user.setEnabled(true); // Set the flag back to true
        
        return userRepository.save(user); // Save the updated user
    }
    
    /**
     * Resolves a dispute by changing its status.
     */
    public Dispute resolveDispute(Long disputeId) {
        Dispute dispute = disputeRepository.findById(disputeId)
            .orElseThrow(() -> new RuntimeException("Dispute not found with id: " + disputeId));
        dispute.setStatus(DisputeStatus.RESOLVED);
        dispute.setResolvedAt(java.time.LocalDateTime.now());
        return disputeRepository.save(dispute);
    }
    
      /**
     * Retrieves a list of all rides created on the platform.
     */
    @Transactional(readOnly = true)
    public List<AdminRideViewDTO> getAllRidesWithDetails() {
        List<Ride> rides = rideRepository.findAll();
        
        return rides.stream().map(ride -> {
            AdminRideViewDTO dto = new AdminRideViewDTO();
            dto.setId(ride.getId());
            dto.setSource(ride.getSource());
            dto.setDestination(ride.getDestination());
            // Safely access the lazy-loaded driver within the transactional method
            if (ride.getDriver() != null) {
                dto.setDriverName(ride.getDriver().getName());
            }
            dto.setDate(ride.getDate());
            dto.setTime(ride.getTime());
            dto.setSeatsAvailable(ride.getSeatsAvailable());
            dto.setPrice(ride.getPrice());
            dto.setStatus(ride.getStatus());
            return dto;
        }).collect(Collectors.toList());
    }
    

    /**
     * Retrieves a list of all bookings made on the platform.
     */
    @Transactional(readOnly = true) // Crucial for accessing lazy-loaded relations
    public List<AdminBookingViewDTO> getAllBookingsWithDetails() {
        List<Booking> bookings = bookingRepository.findAll();
        
        return bookings.stream().map(booking -> {
            AdminBookingViewDTO dto = new AdminBookingViewDTO();
            dto.setId(booking.getId());

            // Safely map data from related entities
            if (booking.getRide() != null) {
                dto.setRideRoute(booking.getRide().getSource() + " → " + booking.getRide().getDestination());
            } else {
                dto.setRideRoute("Ride info missing");
            }
            
            if (booking.getPassenger() != null) {
                dto.setPassengerName(booking.getPassenger().getName());
            } else {
                dto.setPassengerName("Passenger info missing");
            }

            dto.setSeatsBooked(booking.getSeatsBooked());
            dto.setTotalFare(booking.getTotalFare());
            dto.setStatus(booking.getStatus());

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Retrieves a list of all payment transactions.
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    /**
     * Calculates the total amount of money earned by all drivers.
     * This is the sum of all payment amounts minus the platform fees.
     */
    public Double getTotalDriverEarnings() {
        return paymentRepository.sumTotalDriverEarnings().orElse(0.0); // We will add this to the repo
    }
    
     public List<WeeklyReportDTO> getWeeklyReport() {
        // Set the start date to 6 days ago (to get 7 total days including today)
        LocalDateTime startDate = LocalDate.now().minusDays(6).atStartOfDay();
        
        // Fetch aggregated data from repositories
       Map<LocalDate, Long> ridesByDay = rideRepository.countRidesPerDay(startDate).stream()
        .map(result -> new DailyStat(
            ((Date) result[0]).toLocalDate(), // Cast to java.sql.Date and convert
            ((Number) result[1]).longValue()  // Cast to Number and get long value
        ))
        .collect(Collectors.toMap(DailyStat::date, DailyStat::count));
        
    Map<LocalDate, Double> earningsByDay = paymentRepository.sumEarningsPerDay(startDate).stream()
        .map(result -> new DailyStatDouble(
            ((Date) result[0]).toLocalDate(),
            result[1] != null ? ((BigDecimal) result[1]).doubleValue() : 0.0 // SUM can be BigDecimal or null
        ))
        .collect(Collectors.toMap(DailyStatDouble::date, DailyStatDouble::value));

    Map<LocalDate, Long> newUsersByDay = userRepository.countNewUsersPerDay(startDate).stream()
        .map(result -> new DailyStat(
            ((Date) result[0]).toLocalDate(),
            ((Number) result[1]).longValue()
        ))
        .collect(Collectors.toMap(DailyStat::date, DailyStat::count));


        // Create a report for the last 7 days, filling in any days that had zero activity.
        return IntStream.range(0, 7) // Generates numbers from 0 to 6
            .mapToObj(i -> LocalDate.now().minusDays(i)) // Creates a stream of the last 7 dates
            .map(date -> {
                WeeklyReportDTO dto = new WeeklyReportDTO();
                dto.setDate(date);
                dto.setRideCount(ridesByDay.getOrDefault(date, 0L));
                dto.setTotalEarnings(earningsByDay.getOrDefault(date, 0.0));
                dto.setNewUserCount(newUsersByDay.getOrDefault(date, 0L));
                return dto;
            })
            .sorted(Comparator.comparing(WeeklyReportDTO::getDate)) // Sort the results by date ascending
            .collect(Collectors.toList());
    }
}
