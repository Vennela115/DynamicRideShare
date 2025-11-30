package com.dynamicridesharing.repository;

import com.dynamicridesharing.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import com.dynamicridesharing.dto.DailyStatDouble;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query; 
import java.time.LocalDateTime;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPassengerIdOrDriverIdOrderByCreatedAtDesc(Long passengerId, Long driverId);
    List<Payment> findByPassengerIdOrderByCreatedAtDesc(Long passengerId);
    List<Payment> findByDriverIdOrderByCreatedAtDesc(Long driverId);
    
     // ADD THIS METHOD:
    @Query("SELECT SUM(p.platformFee) FROM Payment p")
    Optional<Double> sumPlatformFee();
    
    @Query("SELECT SUM(p.amount - p.platformFee) FROM Payment p")
    Optional<Double> sumTotalDriverEarnings();
    
     @Query(value = "SELECT DATE(p.created_at) AS date, SUM(p.platform_fee) AS value " +
                   "FROM payments p " +
                   "WHERE p.created_at >= :startDate " +
                   "GROUP BY DATE(p.created_at) " +
                   "ORDER BY DATE(p.created_at)",
           nativeQuery = true)
    List<Object[]> sumEarningsPerDay(@Param("startDate") LocalDateTime startDate);


}
