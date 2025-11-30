package com.dynamicridesharing.dto;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * A DTO for the Admin's view of all rides, safely handling lazy-loaded data.
 */
public class AdminRideViewDTO {
    private Long id;
    private String source;
    private String destination;
    private String driverName; // Flattened for simplicity
    private LocalDate date;
    private LocalTime time;
    private int seatsAvailable;
    private double price;
    private String status;

    // Getters and Setters for all fields...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }
    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }
    public int getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
