// src/main/java/com/dynamicridesharing/repository/RideRepository.java
package com.dynamicridesharing.repository;
import com.dynamicridesharing.dto.DailyStat;
import com.dynamicridesharing.model.Ride;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriver_Id(Long driverId);
    List<Ride> findBySourceAndDestinationAndDate(String source, String destination, LocalDate date);
     // ADD THIS NEW METHOD
    List<Ride> findByDateAndSeatsAvailableGreaterThan(LocalDate date, int seats);
     List<Ride> findByDateGreaterThanEqualAndSeatsAvailableGreaterThan(LocalDate date, int seats);
     
      @Query(value = "SELECT DATE(r.created_at) AS date, COUNT(r.id) AS count " +
                   "FROM rides r " +
                   "WHERE r.created_at >= :startDate " +
                   "GROUP BY DATE(r.created_at) " +
                   "ORDER BY DATE(r.created_at)",
           nativeQuery = true)
    List<Object[]> countRidesPerDay(@Param("startDate") LocalDateTime startDate);

}
