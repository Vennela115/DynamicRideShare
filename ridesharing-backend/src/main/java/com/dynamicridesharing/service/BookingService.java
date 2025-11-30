package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.BookRideResponse;
import com.dynamicridesharing.dto.RideResponseDTO;
import com.dynamicridesharing.dto.UserResponse;
import com.dynamicridesharing.dto.BookingDetailDTO;
import com.dynamicridesharing.model.*;
import com.dynamicridesharing.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus; 


import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@Transactional 
public class BookingService {

    private final BookingRepository bookingRepo;
    private final RideService rideService;
    private final UserService userService;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepo, RideService rideService, UserService userService, NotificationService notificationService) {
        this.bookingRepo = bookingRepo;
        this.rideService = rideService;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    // Book a ride
    public BookRideResponse bookRide(String passengerEmail, Long rideId, int seatsBooked,double totalFare) {
        if (seatsBooked <= 0) throw new ResponseStatusException(BAD_REQUEST, "Invalid seat count");

        User passenger = userService.findByEmailOrThrow(passengerEmail);

        String role = passenger.getRole();
        if (!("PASSENGER".equalsIgnoreCase(role) || "ROLE_PASSENGER".equalsIgnoreCase(role))) {
            throw new ResponseStatusException(BAD_REQUEST, "Only passengers can book rides");
        }

        Ride ride = rideService.findByIdOrThrow(rideId);
        if (ride.getSeatsAvailable() < seatsBooked) {
            throw new ResponseStatusException(BAD_REQUEST, "Not enough seats available");
        }

        // Deduct seats
        ride.setSeatsAvailable(ride.getSeatsAvailable() - seatsBooked);
        rideService.save(ride);

        // Booking status depends on driver's preference
        BookingStatus status = ride.isRequiredConfirmation() ? BookingStatus.PENDING : BookingStatus.CONFIRMED;

        // Save booking
        Booking b = new Booking();
        b.setRide(ride);
        b.setPassenger(passenger);
        b.setSeatsBooked(seatsBooked);
        b.setBookingTime(LocalDateTime.now());
        b.setStatus(status);
        b.setTotalFare(totalFare); 
        bookingRepo.save(b);

	 notificationService.sendBookingConfirmationEmails(b);

        return mapBookingToResponse(b);
    }

    // Request booking (wrapper)
    public BookRideResponse requestBooking(String passengerEmail, Long rideId, int seatsBooked,double totalFare) {
        return bookRide(passengerEmail, rideId, seatsBooked,totalFare);
    }

    // Approve booking
    public BookRideResponse approveBooking(Long bookingId, String driverEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new ResponseStatusException(BAD_REQUEST, "Not authorized to approve this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is not pending approval");
        }

        booking.setStatus(BookingStatus.APPROVED);
        bookingRepo.save(booking);

        return mapBookingToResponse(booking);
    }

    // Reject booking
    public BookRideResponse rejectBooking(Long bookingId, String driverEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getRide().getDriver().getEmail().equals(driverEmail)) {
            throw new ResponseStatusException(BAD_REQUEST, "Not authorized to reject this booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is not pending approval");
        }

        booking.setStatus(BookingStatus.REJECTED);

        // Restore seats since rejected
        Ride ride = booking.getRide();
        ride.setSeatsAvailable(ride.getSeatsAvailable() + booking.getSeatsBooked());
        rideService.save(ride);

        bookingRepo.save(booking);

        return mapBookingToResponse(booking);
    }

    // Confirm booking
    public BookRideResponse confirmBooking(Long bookingId, String passengerEmail) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getPassenger().getEmail().equals(passengerEmail)) {
            throw new ResponseStatusException(BAD_REQUEST, "Not authorized to confirm this booking");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new ResponseStatusException(BAD_REQUEST, "Booking is not approved yet");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        bookingRepo.save(booking);

        return mapBookingToResponse(booking);
    }

    // Passenger’s bookings
    public List<Booking> passengerBookings(String passengerEmail) {
        User p = userService.findByEmailOrThrow(passengerEmail);
        return bookingRepo.findByPassenger_Id(p.getId());
    }

    // Driver’s bookings
    public List<Booking> driverBookings(String driverEmail) {
        User d = userService.findByEmailOrThrow(driverEmail);
        return bookingRepo.findByRide_Driver_Id(d.getId());
    }

    // --- Private helpers ---
    private Booking findBookingOrThrow(Long bookingId) {
        return bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Booking not found"));
    }

    private BookRideResponse mapBookingToResponse(Booking b) {
        BookRideResponse response = new BookRideResponse();
        response.setId(b.getId());
        // use RideResponseDTO constructor that accepts Ride
        response.setRide(mapRideToDto(b.getRide()));
        response.setPassenger(mapUserToDto(b.getPassenger()));
        response.setDriver(mapUserToDto(b.getRide().getDriver()));
        response.setSeatsBooked(b.getSeatsBooked());

        response.setTotalFare(b.getTotalFare());

        response.setStatus(b.getStatus().name());
        response.setBookingTime(b.getBookingTime());
        return response;
    }
    
    @Transactional(readOnly = true)
public List<BookingDetailDTO> getPassengerBookingsWithDetails(String passengerEmail) {
    // 1. Get the raw booking entities using your existing, working method
    List<Booking> bookings = this.passengerBookings(passengerEmail);

    // 2. Map each Booking entity to the new, detailed BookingDetailDTO
    return bookings.stream().map(booking -> {
        BookingDetailDTO dto = new BookingDetailDTO();
        dto.setId(booking.getId());
        dto.setSeatsBooked(booking.getSeatsBooked());
        dto.setTotalFare(booking.getTotalFare());

        // Create and populate the nested Ride DTO
        BookingDetailDTO.RideInfoDTO rideInfo = new BookingDetailDTO.RideInfoDTO();
        if (booking.getRide() != null) {
            rideInfo.setId(booking.getRide().getId());
            rideInfo.setSource(booking.getRide().getSource());
            rideInfo.setDestination(booking.getRide().getDestination());
            rideInfo.setDate(booking.getRide().getDate());
            rideInfo.setTime(booking.getRide().getTime());
        }
        dto.setRide(rideInfo);

        // Create and populate the nested Driver DTO from the Ride's Driver
        if (booking.getRide() != null && booking.getRide().getDriver() != null) {
            User driver = booking.getRide().getDriver();
            BookingDetailDTO.DriverInfoDTO driverInfo = new BookingDetailDTO.DriverInfoDTO();
            driverInfo.setName(driver.getName());
            driverInfo.setVehicleModel(driver.getVehicleModel());
            driverInfo.setLicensePlate(driver.getLicensePlate());
            dto.setDriver(driverInfo);
        }

        return dto;
    }).collect(Collectors.toList());
}

    private UserResponse mapUserToDto(User user) {
        if (user == null) return null;
        UserResponse dto = new UserResponse();
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setContact(user.getContact());
        dto.setRole(user.getRole());
        dto.setVehicleModel(user.getVehicleModel());
        dto.setLicensePlate(user.getLicensePlate());
        return dto;
    }

    private RideResponseDTO mapRideToDto(Ride ride) {
        if (ride == null) return null;
        return new RideResponseDTO(ride);
    }
    
     public void cancelBooking(Long bookingId, String passengerEmail) {
        Booking booking = bookingRepo.findById(bookingId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
        
        User passenger = userService.findByEmailOrThrow(passengerEmail);

        if (!booking.getPassenger().getId().equals(passenger.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to cancel this booking.");
        }
        
        if (booking.getRide().getDate().isBefore(java.time.LocalDate.now())) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel a ride that has already occurred.");
        }
        
        Ride ride = booking.getRide();
        ride.setSeatsAvailable(ride.getSeatsAvailable() + booking.getSeatsBooked());
        rideService.save(ride);

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepo.save(booking);
        
        // Optional: Notify the driver of the cancellation
        // notificationService.sendPassengerCancellationEmailToDriver(booking);
    }
    
}

