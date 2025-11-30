// src/main/java/com/dynamicridesharing/model/Booking.java
package com.dynamicridesharing.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Ride ride;

    @ManyToOne(optional = false)
    private User passenger;

    private int seatsBooked;
    private LocalDateTime bookingTime;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;
    
    @Column(nullable = false)
    private double totalFare;   // ✅ NEW FIELD

    // --- Getters & Setters ---
    public double getTotalFare() { return totalFare; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }


    // --- Constructors ---
    public Booking() {}

    public Booking(Long id, Ride ride, User passenger, int seatsBooked,
                   LocalDateTime bookingTime, BookingStatus status, double totalFare) {
        this.id = id;
        this.ride = ride;
        this.passenger = passenger;
        this.seatsBooked = seatsBooked;
        this.bookingTime = bookingTime;
        this.status = status;
        this.totalFare = totalFare;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Ride getRide() { return ride; }
    public void setRide(Ride ride) { this.ride = ride; }

    public User getPassenger() { return passenger; }
    public void setPassenger(User passenger) { this.passenger = passenger; }

    public int getSeatsBooked() { return seatsBooked; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }

    public LocalDateTime getBookingTime() { return bookingTime; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
}
