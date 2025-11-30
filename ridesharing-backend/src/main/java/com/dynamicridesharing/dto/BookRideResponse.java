// src/main/java/com/dynamicridesharing/dto/BookRideResponse.java
package com.dynamicridesharing.dto;

import java.time.LocalDateTime;

public class BookRideResponse {
    private Long id;
    private RideResponseDTO ride;   // ✅ correct type
    private UserResponse passenger;
    private UserResponse driver;
    private int seatsBooked;
    private double totalFare;
    private String status;  // will carry enum name
    private LocalDateTime bookingTime;

    // --- Getters ---
    public Long getId() { return id; }
    public RideResponseDTO getRide() { return ride; }   // ✅ fixed
    public UserResponse getPassenger() { return passenger; }
    public UserResponse getDriver() { return driver; }
    public int getSeatsBooked() { return seatsBooked; }
    public double getTotalFare() { return totalFare; }
    public String getStatus() { return status; }
    public LocalDateTime getBookingTime() { return bookingTime; }

    // --- Setters ---
    public void setId(Long id) { this.id = id; }
    public void setRide(RideResponseDTO ride) { this.ride = ride; }   // ✅ fixed
    public void setPassenger(UserResponse passenger) { this.passenger = passenger; }
    public void setDriver(UserResponse driver) { this.driver = driver; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public void setStatus(String status) { this.status = status; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
}

