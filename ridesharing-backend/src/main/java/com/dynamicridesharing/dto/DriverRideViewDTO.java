package com.dynamicridesharing.dto;

import java.time.LocalDate;
import java.util.List;

/**
 * A comprehensive Data Transfer Object (DTO) designed specifically for the 
 * driver's "My Rides" page. It combines ride details, driver vehicle information,
 * and a list of all booked passengers into a single, clean object.
 */
public class DriverRideViewDTO {

    // --- Basic Ride Info ---
    private Long id;
    private String source;
    private String destination;
    private LocalDate date;
    private String time;
    private int seatsAvailable;
    private double price;

    // --- Driver's Vehicle Info ---
    private String driverVehicleModel;
    private String driverLicensePlate;

    // --- List of Booked Passengers ---
    private List<PassengerInfoDTO> passengers;
    
    /**
     * Default constructor.
     */
    public DriverRideViewDTO() {
    }

    // --- Getters and Setters for all fields ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getSeatsAvailable() {
        return seatsAvailable;
    }

    public void setSeatsAvailable(int seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getDriverVehicleModel() {
        return driverVehicleModel;
    }

    public void setDriverVehicleModel(String driverVehicleModel) {
        this.driverVehicleModel = driverVehicleModel;
    }

    public String getDriverLicensePlate() {
        return driverLicensePlate;
    }

    public void setDriverLicensePlate(String driverLicensePlate) {
        this.driverLicensePlate = driverLicensePlate;
    }

    public List<PassengerInfoDTO> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerInfoDTO> passengers) {
        this.passengers = passengers;
    }
}
