// src/main/java/com/dynamicridesharing/dto/RegisterRequest.java
package com.dynamicridesharing.dto;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role;        // client can send PASSENGER / DRIVER (no ROLE_ prefix)
    private String contact;

    // Driver fields (optional unless role=DRIVER)
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;

    // Getters & Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }

    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }

    public String getLicensePlate() { return licensePlate; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
}
