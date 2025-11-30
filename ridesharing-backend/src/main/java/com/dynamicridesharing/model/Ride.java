// src/main/java/com/dynamicridesharing/model/Ride.java
package com.dynamicridesharing.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp; // <-- ADD THIS IMPORT
import java.time.LocalDateTime;

import java.time.LocalDate;
import java.time.LocalTime;
// --- ADD THESE IMPORTS ---
import java.util.ArrayList;
import java.util.List;
// -------------------------

@Entity
@Table(name = "rides")
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private int seatsAvailable;

    private String status;

    private int capacity;

    private double price;

    private boolean requiredConfirmation = false;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JsonIgnore
    private User driver;

    // --- THIS IS THE NEW RELATIONSHIP ---
    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Booking> bookings = new ArrayList<>();
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    // --------------------

    // --- ADD GETTER/SETTER ---
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    // ------------------------------------

    // --- Constructors ---
    public Ride() {}

    public Ride(Long id, String source, String destination, LocalDate date,
                LocalTime time, int seatsAvailable, User driver, double price,
                boolean requiredConfirmation) {
        this.id = id;
        this.source = source;
        this.destination = destination;
        this.date = date;
        this.time = time;
        this.seatsAvailable = seatsAvailable;
        this.driver = driver;
        this.price = price;
        this.requiredConfirmation = requiredConfirmation;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getTime() { return time; }
    public void setTime(LocalTime time) { this.time = time; }

    public int getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public double getPrice(){ return price; }
    public void setPrice(double price){ this.price = price; }

    public boolean isRequiredConfirmation() { return requiredConfirmation; }
    public void setRequiredConfirmation(boolean requiredConfirmation) {
        this.requiredConfirmation = requiredConfirmation;
    }

    // --- ADD GETTER AND SETTER FOR BOOKINGS ---
    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }
    // ------------------------------------------
}
