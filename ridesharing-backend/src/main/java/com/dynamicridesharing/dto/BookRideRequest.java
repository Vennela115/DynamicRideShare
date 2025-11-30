package com.dynamicridesharing.dto;

public class BookRideRequest {
    private Long rideId;
    private int seatsBooked;
    private String passengerName;
    private String phone;
    private double totalFare;

    // Getters
    public Long getRideId() { return rideId; }
    public int getSeatsBooked() { return seatsBooked; }
    public String getPassengerName() { return passengerName; }
    public String getPhone() { return phone; }
    public double getTotalFare(){return totalFare;}

    // Setters
    public void setRideId(Long rideId) { this.rideId = rideId; }
    public void setSeatsBooked(int seatsBooked) { this.seatsBooked = seatsBooked; }
    public void setPassengerName(String passengerName) { this.passengerName = passengerName; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setTotalFare(double totalFare) { this.totalFare = totalFare; }
}
