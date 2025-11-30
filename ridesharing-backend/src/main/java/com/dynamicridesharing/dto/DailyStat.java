package com.dynamicridesharing.dto;

import java.time.LocalDate;

public class DailyStat {
    private final LocalDate date;
    private final Long count; // MUST be the wrapper class Long

    // This constructor (LocalDate, Long) is what Hibernate is looking for.
    public DailyStat(LocalDate date, Long count) {
        this.date = date;
        this.count = count;
    }

    public LocalDate date() { return date; }
    public Long count() { return count; }
}
