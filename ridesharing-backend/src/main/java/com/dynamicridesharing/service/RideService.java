package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.RideCreateRequest;
import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.dto.DailyStat;
import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.BookingRepository;
import com.dynamicridesharing.repository.RideRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.dynamicridesharing.dto.DriverRideViewDTO; // <-- Add this import at the top of the file
import com.dynamicridesharing.dto.PassengerInfoDTO; // <-- Add this import at the top of the file
import java.time.LocalDateTime;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@Service
public class RideService {

    private final RideRepository rideRepo;
    private final UserService userService;
    private final BookingRepository bookingRepo;
    private final NotificationService notificationService;

    public RideService(RideRepository rideRepo, UserService userService, BookingRepository bookingRepo, NotificationService notificationService) {
        this.rideRepo = rideRepo;
        this.userService = userService;
        this.bookingRepo = bookingRepo;
        this.notificationService = notificationService;
    }

    public Ride createRide(RideCreateRequest req, String driverEmail) {
        User driver = userService.findByEmailOrThrow(driverEmail);
        String role = String.valueOf(driver.getRole());
        if (!"DRIVER".equalsIgnoreCase(role) && !"ROLE_DRIVER".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(BAD_REQUEST, "Only drivers can post rides");
        }

        int capacity = driver.getCapacity() != 0 ? driver.getCapacity() : 4;
        if (req.getSeatsAvailable() > capacity) {
            throw new ResponseStatusException(BAD_REQUEST, "Seats exceed driver's vehicle capacity");
        }

        Ride r = new Ride();
        r.setSource(req.getSource());
        r.setDestination(req.getDestination());
        r.setDate(req.getDate());
        r.setTime(req.getTime());
        r.setSeatsAvailable(req.getSeatsAvailable());
        r.setDriver(driver);
        r.setPrice(req.getPrice());
        r.setStatus("ACTIVE"); // add a simple status field if not already present

        return rideRepo.save(r);
    }
    
     public List<Ride> getRidesForDriver(String driverEmail) {
        User driver = userService.findByEmailOrThrow(driverEmail);
        return rideRepo.findByDriver_Id(driver.getId());
    }

   public List<DriverRideViewDTO> getDriverRidesWithDetails(String driverEmail) {
    // 1. Fetch the raw ride entities using your existing method
    List<Ride> rides = this.getRidesForDriver(driverEmail);

    // 2. Map each Ride entity to our new, detailed DTO
    return rides.stream().map(ride -> {
        DriverRideViewDTO dto = new DriverRideViewDTO();
        
        // Populate basic ride info from the Ride object
        dto.setId(ride.getId());
        dto.setSource(ride.getSource());
        dto.setDestination(ride.getDestination());
        dto.setDate(ride.getDate());
        
        // Handle potential null time
        if (ride.getTime() != null) {
            dto.setTime(ride.getTime().toString());
        }

        dto.setSeatsAvailable(ride.getSeatsAvailable());
        dto.setPrice(ride.getPrice());

        // Populate driver's vehicle info from the associated User object
        if (ride.getDriver() != null) {
            dto.setDriverVehicleModel(ride.getDriver().getVehicleModel());
            dto.setDriverLicensePlate(ride.getDriver().getLicensePlate());
        }

        // Populate the list of passengers by mapping over the ride's bookings
        List<PassengerInfoDTO> passengers = ride.getBookings().stream()
            .map(booking -> new PassengerInfoDTO(
                booking.getPassenger().getId(),
                booking.getPassenger().getName(),
                booking.getPassenger().getEmail(),
                booking.getSeatsBooked(),
                booking.getId()
            ))
            .collect(Collectors.toList());
        dto.setPassengers(passengers);

        return dto;
    }).collect(Collectors.toList());
}

    public List<Ride> search(String source, String destination, java.time.LocalDate date) {
        return rideRepo.findBySourceAndDestinationAndDate(source, destination, date);
    }

    public Ride findByIdOrThrow(Long id) {
        return rideRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "Ride not found"));
    }

    public Ride save(Ride ride) {
        return rideRepo.save(ride);
    }

    /**
     * Cancel ride (driver only). Marks ride as canceled and returns passenger IDs with bookings.
     */
    public List<Long> cancelRide(Long rideId, String driverEmail) {
        Ride ride = findByIdOrThrow(rideId);
        User driver = userService.findByEmailOrThrow(driverEmail);

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "You can only cancel your own rides");
        }

        ride.setStatus("CANCELLED");
        rideRepo.save(ride);

        List<Booking> bookings = bookingRepo.findByRide_Id(rideId);
        for (Booking booking : bookings) {
            // Notify each passenger
            notificationService.sendRideCancellationEmail(ride, booking.getPassenger());
        }

        return bookings.stream()
                .map(b -> b.getPassenger().getId())
                .collect(Collectors.toList());
    }

    /**
     * Reschedule ride (driver only). Updates time and returns passenger IDs with bookings.
     */
    public List<Long> rescheduleRide(Long rideId, String newTime, String driverEmail) {
        Ride ride = findByIdOrThrow(rideId);
        User driver = userService.findByEmailOrThrow(driverEmail);

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new ResponseStatusException(FORBIDDEN, "You can only reschedule your own rides");
        }

        ride.setTime(LocalTime.parse(newTime));
        rideRepo.save(ride);

        List<Booking> bookings = bookingRepo.findByRide_Id(rideId);
        return bookings.stream()
                .map(b -> b.getPassenger().getId())
                .collect(Collectors.toList());
    }
    
	    public List<Ride> findRidesByDateAndSeats(LocalDate date) {
		    // This finds all rides on a given date that have at least one seat available
		    return rideRepo.findByDateAndSeatsAvailableGreaterThan(date, 0);
		}
		
		  public List<Ride> findPotentialRides(LocalDate date) {
		if (date != null) {
		    // If a date is provided, use the existing logic to find rides for that specific day
		    return rideRepo.findByDateAndSeatsAvailableGreaterThan(date, 0);
		} else {
		    // If no date is provided, find all rides from today onwards
		    LocalDate today = LocalDate.now();
		    return rideRepo.findByDateGreaterThanEqualAndSeatsAvailableGreaterThan(today, 0);
		}
	    }
	    
	    public List<DailyStat> getRideStats(LocalDateTime startDate) {
	    return rideRepo.countRidesPerDay(startDate).stream()
		.map(row -> new DailyStat(
		    ((java.sql.Date) row[0]).toLocalDate(),
		    ((Number) row[1]).longValue()
		))
		.toList();
	}


}
