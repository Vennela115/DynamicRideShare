// src/main/java/com/dynamicridesharing/repository/BookingRepository.java
package com.dynamicridesharing.repository;

import com.dynamicridesharing.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dynamicridesharing.model.BookingStatus;
import java.util.List;
import org.springframework.data.jpa.repository.Query; 
import java.time.LocalDate;
import java.time.LocalTime;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassenger_Id(Long passengerId);
    List<Booking> findByRide_Driver_Id(Long driverId);

    List<Booking> findByRide_Id(Long rideId);
    
    @Query("SELECT b FROM Booking b WHERE b.ride.date = :date AND b.ride.time BETWEEN :startTime AND :endTime AND b.status = :status")
    List<Booking> findUpcomingBookingsForReminder(LocalDate date, LocalTime startTime, LocalTime endTime, BookingStatus status);
}
