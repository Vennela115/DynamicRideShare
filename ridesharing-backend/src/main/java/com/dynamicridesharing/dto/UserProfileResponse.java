// src/main/java/com/dynamicridesharing/dto/UserProfileResponse.java
package com.dynamicridesharing.dto;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String role;

    public UserProfileResponse(Long id, String name, String email, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }

    // Setters (if needed)
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}
