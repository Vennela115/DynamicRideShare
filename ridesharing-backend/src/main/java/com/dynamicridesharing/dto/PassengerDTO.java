package com.dynamicridesharing.dto;

public class PassengerDTO {
    private Long id;
    private String name;
    private String email;
    private String contact;
    private String role;

    public PassengerDTO(Long id, String name, String email, String contact, String role) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.contact = contact;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContact() { return contact; }
    public String getRole() { return role; }
}
