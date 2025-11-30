package com.dynamicridesharing.dto;

import com.dynamicridesharing.model.BookingStatus;

/**
 * A DTO for the Admin's view of all bookings, safely handling lazy-loaded data
 * by flattening the required fields from related entities.
 */
public class AdminBookingViewDTO {

    private Long id;
    private String rideRoute; // e.g., "Kadapa → Hyderabad"
    private String passengerName;
    private int seatsBooked;
    private double totalFare;
    private BookingStatus status;

    // Getters and Setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getRideRoute() { return rideRoute; }
    public void setRideRoute(String rideRoute) { this.rideRoute = rideRoute; }
    public String getPassengerName() { return passengerName; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public int getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
