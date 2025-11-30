// src/main/java/com/dynamicridesharing/repository/UserRepository.java
package com.dynamicridesharing.repository;
import com.dynamicridesharing.dto.DailyStat;
import com.dynamicridesharing.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    Optional<User> findByEmail(String email);
    
    // ADD THIS METHOD:
    List<User> findByRole(String role);
    
    
   @Query(value = "SELECT DATE(u.created_at) AS date, COUNT(u.id) AS count " +
                   "FROM users u " +
                   "WHERE u.created_at >= :startDate " +
                   "GROUP BY DATE(u.created_at) " +
                   "ORDER BY DATE(u.created_at)",
           nativeQuery = true)
    List<Object[]> countNewUsersPerDay(@Param("startDate") LocalDateTime startDate);
    
}
