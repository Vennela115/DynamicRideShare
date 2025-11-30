package com.dynamicridesharing.dto;

public class DriverDTO {
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String role;
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;

    public DriverDTO(Long id, String name, String email, String contact, String role,
                     String vehicleModel, String licensePlate, Integer capacity) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.role = role;
        this.vehicleModel = vehicleModel;
        this.licensePlate = licensePlate;
        this.capacity = capacity;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContact() { return contact; }
    public String getRole() { return role; }
    public String getVehicleModel() { return vehicleModel; }
    public String getLicensePlate() { return licensePlate; }
    public Integer getCapacity() { return capacity; }
}
