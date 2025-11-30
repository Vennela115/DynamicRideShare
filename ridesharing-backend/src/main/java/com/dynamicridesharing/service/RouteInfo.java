package com.dynamicridesharing.service;

import java.util.List;

// A simple record or class to hold route details
public class RouteInfo {
    private final List<double[]> coordinates;
    private final double distanceKm;

    public RouteInfo(List<double[]> coordinates, double distanceKm) {
        this.coordinates = coordinates;
        this.distanceKm = distanceKm;
    }

    public List<double[]> getCoordinates() { return coordinates; }
    public double getDistanceKm() { return distanceKm; }
}
