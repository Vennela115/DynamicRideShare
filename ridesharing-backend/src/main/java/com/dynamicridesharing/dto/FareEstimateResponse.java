package com.dynamicridesharing.dto;

public class FareEstimateResponse {
    private double distanceKm;
    private double baseFare;
    private double ratePerKm;
    private double totalFare;

    public FareEstimateResponse(double distanceKm, double baseFare, double ratePerKm, double totalFare) {
        this.distanceKm = distanceKm;
        this.baseFare = baseFare;
        this.ratePerKm = ratePerKm;
        this.totalFare = totalFare;
    }
    public double getDistanceKm() { return distanceKm; }
    public double getBaseFare() { return baseFare; }
    public double getRatePerKm() { return ratePerKm; }
    public double getTotalFare() { return totalFare; }
}
