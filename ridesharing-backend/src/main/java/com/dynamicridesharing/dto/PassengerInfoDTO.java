package com.dynamicridesharing.dto;

/**
 * A Data Transfer Object (DTO) to hold essential information about a passenger 
 * who has booked a ride. This is used to create a list of passengers for the driver's view.
 */
public class PassengerInfoDTO {

    private Long id;
    private String name;
    private String email;
    private int seatsBooked;
    private Long bookingId;

    /**
     * Default constructor.
     */
    public PassengerInfoDTO() {
    }

    /**
     * Constructor to initialize all fields.
     */
    public PassengerInfoDTO(Long id, String name, String email, int seatsBooked,Long bookingId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.seatsBooked = seatsBooked;
        this.bookingId=bookingId;
        
    }

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long id) {
        this.bookingId = bookingId;
    }


    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(int seatsBooked) {
        this.seatsBooked = seatsBooked;
    }
}
