// src/main/java/com/dynamicridesharing/model/User.java
package com.dynamicridesharing.model;
import org.hibernate.annotations.CreationTimestamp; // <-- ADD THIS IMPORT
import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private String name;
    @Column(nullable=false, unique=true) private String email;
    @Column(nullable=false) private String password;

    // Store as "ROLE_PASSENGER", "ROLE_DRIVER", "ROLE_ADMIN"
    @Column(nullable=false) private String role;

    private String contact;

    // Driver-specific fields (nullable)
    private String vehicleModel;
    private String licensePlate;
    private Integer capacity;
    
     @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean enabled = true;
    
     @Transient // Informs JPA to not map this field to a database column
    private Double averageRating = 0.0;
    
    @Enumerated(EnumType.STRING)
    private VerificationStatus verificationStatus;
    
    private String licenseNumber; // To store the driving license number
    
     @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    // --------------------

    // --- ADD GETTER/SETTER ---
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // --- ADD GETTERS AND SETTERS ---
    public VerificationStatus getVerificationStatus() { return verificationStatus; }
    public void setVerificationStatus(VerificationStatus status) { this.verificationStatus = status; }

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    // Getters/Setters (no Lombok)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public Integer getCapacity() { return capacity; }   // Integer to avoid NPE during JSON write
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    
     public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
