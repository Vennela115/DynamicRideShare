package com.dynamicridesharing.controller;

import com.dynamicridesharing.dto.MatchResponseDTO;
import com.dynamicridesharing.service.RouteMatchingService; 
import com.dynamicridesharing.dto.RideCreateRequest;
import com.dynamicridesharing.dto.RideResponseDTO;
import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.service.RideService;
import com.dynamicridesharing.service.NotificationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.dynamicridesharing.service.RoutingService; // Import RoutingService
import com.dynamicridesharing.service.RouteInfo; // Import RouteInfo
import com.dynamicridesharing.dto.DriverRideViewDTO;
import com.dynamicridesharing.service.ReviewService;
import com.dynamicridesharing.model.User;

import com.dynamicridesharing.service.UserService;

import org.springframework.http.ResponseEntity;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.Map; 

@RestController
@RequestMapping("/api/rides")
@CrossOrigin(origins = "http://localhost:5173")
public class RideController {

    private final RideService rideService;
    private final RoutingService routingService;
    private final RouteMatchingService routeMatcher; //Injecttheservice

    private final NotificationService notificationService;
     private final UserService userService;
    private final ReviewService reviewService;

    public RideController(RideService rideService, NotificationService notificationService, RouteMatchingService routeMatcher,RoutingService routingService, ReviewService reviewService,UserService userService) {
        this.rideService = rideService;
        this.notificationService = notificationService;
        this.routeMatcher = routeMatcher;
        this.routingService = routingService; 
        this.reviewService = reviewService;
        this.userService = userService;
    }

    // Only drivers can create rides
    @PostMapping("/create")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")  // keep your existing rule
    public Ride create(@RequestBody RideCreateRequest req, Principal principal) {
        return rideService.createRide(req, principal.getName());
    }

    @GetMapping("/driver")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public List<DriverRideViewDTO> myRides(Principal principal) {
    // It now calls the new service method and returns the detailed DTO
    	return rideService.getDriverRidesWithDetails(principal.getName());
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyAuthority('ROLE_PASSENGER','ROLE_DRIVER')")
    // 1. The return type changes from List<RideResponseDTO> to MatchResponseDTO
    public MatchResponseDTO search(
            @RequestParam String source,
            @RequestParam String destination,
            // 2. We keep your clean LocalDate parameter - this is great!
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        // 3. The core logic is now replaced.
        // Instead of calling rideService.search, we fetch potential rides from the repository
        // to prepare for categorization.
        List<Ride> potentialRides = rideService.findPotentialRides(date); // We will add this method to the service

        // 4. Initialize lists for categorization
        List<RideResponseDTO> directMatches = new ArrayList<>();
        List<RideResponseDTO> partialMatches = new ArrayList<>();
        
        

        // 5. Iterate and categorize each ride using the routeMatcher
        for (Ride ride : potentialRides) {
            // First, check for a direct match (fastest check)
            RideResponseDTO dto = new RideResponseDTO(ride);
            
             if (ride.getDriver() != null) {
                double avgRating = reviewService.getAverageRatingForUser(ride.getDriver().getId());
                dto.setDriverAverageRating(avgRating);
            }
            
            
            if (routeMatcher.isDirect(ride, source, destination)) {
                directMatches.add(dto);
            }
            // If not direct, check for a partial match (slower, involves API calls)
            else if (routeMatcher.isNear(ride, source, destination)) {
                // partialMatches.add(new RideResponseDTO(ride));
                // --- DYNAMIC FARE CALCULATION LOGIC ---

            // 1. Get distance of the driver's full route
            RouteInfo driverRouteInfo = routingService.getRouteInfo(ride.getSource(), ride.getDestination());

            // 2. Get distance of the passenger's desired partial route
            RouteInfo passengerRouteInfo = routingService.getRouteInfo(source, destination);

            // 3. Calculate and set the new price
            if (driverRouteInfo != null && passengerRouteInfo != null && driverRouteInfo.getDistanceKm() > 0) {
                double ratePerKm = ride.getPrice() / driverRouteInfo.getDistanceKm();
                double newFare = ratePerKm * passengerRouteInfo.getDistanceKm();

                // Create the DTO and override the price
                // RideResponseDTO dto = new RideResponseDTO(ride);
                // Round the fare to a reasonable value (e.g., nearest integer)
                dto.setPrice((double) Math.round(newFare)); 
                
                partialMatches.add(dto);
            }
            
            }
        }

        // 6. Return the new, structured response object
        return new MatchResponseDTO(directMatches, partialMatches);
    }

    /**
     * Cancel ride (driver action) - notify passengers who booked this ride
     * Assumes rideService.cancelRide returns List<Long> passengerIds affected (adjust if signature differs)
     */
    @PostMapping("/{rideId}/cancel")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public void cancelRide(@PathVariable Long rideId, Principal principal) {
         rideService.cancelRide(rideId, principal.getName());

       
    }

    /**
     * Reschedule ride (driver action) - notify passengers with new time
     * Assumes rideService.rescheduleRide returns List<Long> passengerIds
     */
    @PostMapping("/{rideId}/reschedule")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public void rescheduleRide(@PathVariable Long rideId,
                               @RequestParam String newTime,
                               Principal principal) {
         rideService.rescheduleRide(rideId, newTime, principal.getName());

        
    }
    
    @GetMapping("/driver/stats")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public ResponseEntity<Map<String, Object>> getDriverStats(Principal principal) {
        User driver = userService.findByEmailOrThrow(principal.getName());
        double avgRating = reviewService.getAverageRatingForUser(driver.getId());
        long reviewCount = reviewService.getReviewCountForUser(driver.getId()); // We will add this to the service

        Map<String, Object> stats = Map.of(
            "averageRating", avgRating,
            "reviewCount", reviewCount
        );
        return ResponseEntity.ok(stats);
    }
}
