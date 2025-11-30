package com.dynamicridesharing.dto;

import com.dynamicridesharing.model.Ride;

import java.time.LocalDate;
import java.time.LocalTime;

public class RideResponseDTO {
    private Long id;
    private String source;
    private String destination;
    private LocalDate date;
    private LocalTime time;
    private int seatsAvailable;
    private double price;

    // New field exposed to frontend
    private boolean requiredConfirmation;

    // Driver details
    private Long driverId;
    private String driverName;
    private String driverEmail;
    private String driverContact;
    private String driverVehicleModel;
    private String driverLicensePlate;
    
    private Double driverAverageRating;

    // No-arg constructor (needed by frameworks and for setter-based mapping)
    public RideResponseDTO() {}

    // Constructor from entity (convenience)
    public RideResponseDTO(Ride ride) {
        if (ride == null) return;
        this.id = ride.getId();
        this.source = ride.getSource();
        this.destination = ride.getDestination();
        this.date = ride.getDate();
        this.time = ride.getTime();
        this.seatsAvailable = ride.getSeatsAvailable();
        this.price = ride.getPrice();
        this.requiredConfirmation = ride.isRequiredConfirmation();

        if (ride.getDriver() != null) {
            this.driverId = ride.getDriver().getId();
            this.driverName = ride.getDriver().getName();
            this.driverEmail = ride.getDriver().getEmail();
            this.driverContact = ride.getDriver().getContact();
            this.driverVehicleModel = ride.getDriver().getVehicleModel();
            this.driverLicensePlate = ride.getDriver().getLicensePlate();
        }
    }

    // --- Getters & Setters ---
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

    public int getSeatsAvailable() { return seatsAvailable; }
    public void setSeatsAvailable(int seatsAvailable) { this.seatsAvailable = seatsAvailable; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public boolean isRequiredConfirmation() { return requiredConfirmation; }
    public void setRequiredConfirmation(boolean requiredConfirmation) { this.requiredConfirmation = requiredConfirmation; }

    public Long getDriverId() { return driverId; }
    public void setDriverId(Long driverId) { this.driverId = driverId; }

    public String getDriverName() { return driverName; }
    public void setDriverName(String driverName) { this.driverName = driverName; }

    public String getDriverEmail() { return driverEmail; }
    public void setDriverEmail(String driverEmail) { this.driverEmail = driverEmail; }

    public String getDriverContact() { return driverContact; }
    public void setDriverContact(String driverContact) { this.driverContact = driverContact; }

    public String getDriverVehicleModel() { return driverVehicleModel; }
    public void setDriverVehicleModel(String driverVehicleModel) { this.driverVehicleModel = driverVehicleModel; }

    public String getDriverLicensePlate() { return driverLicensePlate; }
    public void setDriverLicensePlate(String driverLicensePlate) { this.driverLicensePlate = driverLicensePlate; }
    
      public Double getDriverAverageRating() {
        return driverAverageRating;
    }

    public void setDriverAverageRating(Double driverAverageRating) {
        this.driverAverageRating = driverAverageRating;
    }
}

