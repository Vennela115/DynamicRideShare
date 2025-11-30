// src/main/java/com/dynamicridesharing/dto/RideCreateRequest.java
package com.dynamicridesharing.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideCreateRequest {
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private int seatsAvailable;
    private double price;

    // ✅ New field
    private boolean requiredConfirmation;

    // Getters
    public String getSource() { return source; }
    public String getDestination() { return destination; }
    public LocalDate getDate() { return date; }
    public LocalTime getTime(){ return time; }
    public int getSeatsAvailable() { return seatsAvailable; }
    public double getPrice() { return price; }
    public boolean isRequiredConfirmation() { return requiredConfirmation; }

    // Setters
    public void setSource(String source) { this.source = source; }
    public void setDestination(String destination) { this.destination = destination; }
    public void setDate(LocalDate date) { this.date = date; }
    public void setTime(LocalTime time) { this.time = time; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }
    public void setPrice(double price) { this.price = price; }
    public void setRequiredConfirmation(boolean requiredConfirmation) {
        this.requiredConfirmation = requiredConfirmation;
    }
}
