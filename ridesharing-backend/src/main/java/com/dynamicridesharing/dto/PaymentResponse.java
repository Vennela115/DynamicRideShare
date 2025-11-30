package com.dynamicridesharing.dto;

import com.dynamicridesharing.model.Payment;
import java.time.LocalDateTime;

public class PaymentResponse {
    private Long id;
    private Long bookingId;
    private Long rideId;
    private Long passengerId;
    private Long driverId;
    private Double amount;
    private String status;
    private String provider;
    private String providerRef;
    private LocalDateTime createdAt;

    public PaymentResponse(Payment p) {
        this.id = p.getId();
        this.bookingId = p.getBookingId();
        this.rideId = p.getRideId();
        this.passengerId = p.getPassengerId();
        this.driverId = p.getDriverId();
        this.amount = p.getAmount();
        this.status = p.getStatus();
        this.provider = p.getProvider();
        this.providerRef = p.getProviderRef();
        this.createdAt = p.getCreatedAt();
    }

    // getters
    public Long getId(){return id;}
    public Long getBookingId(){return bookingId;}
    public Long getRideId(){return rideId;}
    public Long getPassengerId(){return passengerId;}
    public Long getDriverId(){return driverId;}
    public Double getAmount(){return amount;}
    public String getStatus(){return status;}
    public String getProvider(){return provider;}
    public String getProviderRef(){return providerRef;}
    public LocalDateTime getCreatedAt(){return createdAt;}
}
