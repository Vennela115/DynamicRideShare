package com.dynamicridesharing.service;

import org.springframework.stereotype.Service;

@Service
public class FareService {

    // tweak these safely without breaking anything else
    private static final double BASE_FARE = 50.0;   // ₹
    private static final double RATE_PER_KM = 10.0; // ₹/km

    public double getBaseFare(){ return BASE_FARE; }
    public double getRatePerKm(){ return RATE_PER_KM; }

    public double calculate(double distanceKm, int passengerCount) {
        double total = BASE_FARE + (RATE_PER_KM * Math.max(0, distanceKm));
        if (passengerCount > 1) return round2(total / passengerCount);
        return round2(total);
    }

    private double round2(double v){ return Math.round(v * 100.0) / 100.0; }
}
