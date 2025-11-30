package com.dynamicridesharing.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideResponse {
    private Long id;
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private int seatsAvailable;
    private double price;

    // --- Getters ---
    public Long getId() { return id; }
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getDate() { return date; }
    public LocalTime getTime() { return time; }
    public int getSeatsAvailable() { return seatsAvailable; }
    public double getPrice() { return price; }

    // --- Setters ---
    public void setId(Long id) { this.id = id; }
    public void setSource(String source) { this.source = source; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setTime(LocalTime time) { this.time = time; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }
    public void setPrice(double price) { this.price = price; }
}
