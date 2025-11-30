package com.dynamicridesharing.dto;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * A detailed DTO for the passenger's "My Bookings" page.
 * It combines all necessary information from Booking, Ride, and Driver entities.
 */
public class BookingDetailDTO {

    private Long id;
    private int seatsBooked;
    private double totalFare;
    private RideInfoDTO ride;
    private DriverInfoDTO driver;

    // --- Nested DTO for Ride Information ---
    public static class RideInfoDTO {
        private Long id;
        private String source;
        private String destination;
        private LocalDate date;
        private LocalTime time;

        // Getters and Setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSource() { return source; }
        public void setSource(String source) { this.source = source; }
        public String getDestination() { return destination; }
        public void setDestination(String destination) { this.destination = destination; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public LocalTime getTime() { return time; }
        public void setTime(LocalTime time) { this.time = time; }
    }

    // --- Nested DTO for Driver Information ---
    public static class DriverInfoDTO {
        private String name;
        private String vehicleModel;
        private String licensePlate;

        // Getters and Setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getVehicleModel() { return vehicleModel; }
        public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
        public String getLicensePlate() { return licensePlate; }
        public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
    }

    // --- Getters and Setters for the main DTO ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public int getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
    public RideInfoDTO getRide() { return ride; }
    public void setRide(RideInfoDTO ride) { this.ride = ride; }
    public DriverInfoDTO getDriver() { return driver; }
    public void setDriver(DriverInfoDTO driver) { this.driver = driver; }
}
