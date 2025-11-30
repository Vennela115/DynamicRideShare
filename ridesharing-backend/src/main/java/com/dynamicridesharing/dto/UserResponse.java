package com.dynamicridesharing.dto;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String role;
    private String vehicleModel;
    private String licensePlate;

    // --- Getters ---
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContact() { return contact; }
    public String getRole() { return role; }
    public String getVehicleModel() { return vehicleModel; }
    public String getLicensePlate() { return licensePlate; }

    // --- Setters ---
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setContact(String contact) { this.contact = contact; }
    public void setRole(String role) { this.role = role; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public void setLicensePlate(String licensePlate) { this.licensePlate = licensePlate; }
}
