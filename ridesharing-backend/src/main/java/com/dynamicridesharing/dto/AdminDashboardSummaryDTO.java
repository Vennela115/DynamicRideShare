package com.dynamicridesharing.dto;

/**
 * A DTO to encapsulate the summary data for the Admin Dashboard.
 * This object is returned by the /api/admin/dashboard/summary endpoint.
 */
public class AdminDashboardSummaryDTO {

    private long totalUsers;
    private long totalRides;
    private double totalPlatformEarnings;
    private long openDisputes;
    private double totalDriverEarnings; 

    public AdminDashboardSummaryDTO(long totalUsers, long totalRides, double totalPlatformEarnings, long openDisputes, double totalDriverEarnings ) {
        this.totalUsers = totalUsers;
        this.totalRides = totalRides;
        this.totalPlatformEarnings = totalPlatformEarnings;
        this.openDisputes = openDisputes;
        this.totalDriverEarnings = totalDriverEarnings;
    }

    // --- Getters and Setters ---

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(long totalRides) {
        this.totalRides = totalRides;
    }

    public double getTotalPlatformEarnings() {
        return totalPlatformEarnings;
    }

    public void setTotalPlatformEarnings(double totalPlatformEarnings) {
        this.totalPlatformEarnings = totalPlatformEarnings;
    }

    public long getOpenDisputes() {
        return openDisputes;
    }

    public void setOpenDisputes(long openDisputes) {
        this.openDisputes = openDisputes;
    }
     public double getTotalDriverEarnings() {
        return totalDriverEarnings;
    }

    public void setTotalDriverEarnings(double totalDriverEarnings) {
        this.totalDriverEarnings = totalDriverEarnings;
    }
}
