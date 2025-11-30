package com.dynamicridesharing.dto;

import java.time.LocalDate;

public class WeeklyReportDTO {
    private LocalDate date;
    private long rideCount;
    private double totalEarnings; // This is platform earnings
    private long newUserCount;

    // Getters and Setters for all fields...
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public long getRideCount() { return rideCount; }
    public void setRideCount(long rideCount) { this.rideCount = rideCount; }
    public double getTotalEarnings() { return totalEarnings; }
    public void setTotalEarnings(double totalEarnings) { this.totalEarnings = totalEarnings; }
    public long getNewUserCount() { return newUserCount; }
    public void setNewUserCount(long newUserCount) { this.newUserCount = newUserCount; }
}
