// src/main/java/com/dynamicridesharing/model/BookingStatus.java
package com.dynamicridesharing.model;

public enum BookingStatus {
    PENDING,    // waiting for driver confirmation
    CONFIRMED,  // accepted by driver or auto-confirmed
    REJECTED,   // rejected by driver
    APPROVED,
    CANCELLED   // cancelled by passenger
}
