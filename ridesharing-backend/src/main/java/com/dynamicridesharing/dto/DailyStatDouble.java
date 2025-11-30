package com.dynamicridesharing.dto;

import java.time.LocalDate;

public class DailyStatDouble {
    private final LocalDate date;
    private final Double value; // MUST be the wrapper class Double

    public DailyStatDouble(LocalDate date, Double value) {
        this.date = date;
        this.value = value;
    }

    public LocalDate date() { return date; }
    public Double value() { return value; }
}
