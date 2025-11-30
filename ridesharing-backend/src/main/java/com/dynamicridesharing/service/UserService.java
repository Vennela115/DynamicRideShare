// src/main/java/com/dynamicridesharing/service/UserService.java
package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.DailyStat;
import com.dynamicridesharing.dto.RegisterRequest;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.dynamicridesharing.model.VerificationStatus;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import java.util.List;
import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepo, PasswordEncoder encoder, NotificationService notificationService) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.notificationService = notificationService;
    }

    public User register(RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(BAD_REQUEST, "Email already registered");
        }

        if (req.getRole() != null && "ADMIN".equalsIgnoreCase(req.getRole())) {
            throw new ResponseStatusException(BAD_REQUEST, "Admin cannot self-register");
        }

        User u = new User();
        u.setName(req.getName());
        u.setEmail(req.getEmail());
        u.setPassword(encoder.encode(req.getPassword()));
        u.setContact(req.getContact());

        // Map client input to ROLE_* (default PASSENGER)
        String raw = (req.getRole() == null || req.getRole().isBlank())
                ? "PASSENGER"
                : req.getRole().toUpperCase();
        if (!raw.startsWith("ROLE_")) raw = "ROLE_" + raw;
        u.setRole(raw); // e.g., ROLE_PASSENGER / ROLE_DRIVER

        // Driver-specific defaults
        if ("ROLE_DRIVER".equalsIgnoreCase(u.getRole())) {
            u.setVehicleModel(req.getVehicleModel());
            u.setLicensePlate(req.getLicensePlate());
            u.setCapacity(req.getCapacity() != null ? req.getCapacity() : 4);
            u.setVerificationStatus(VerificationStatus.UNVERIFIED);
        }
        
        User savedUser = userRepo.save(u);
	notificationService.sendWelcomeEmail(savedUser);
        return savedUser;
    }

    public User findByEmailOrThrow(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "User not found"));
    }

    public User updateDriverVehicle(String email, String model, String plate, Integer capacity) {
        User driver = findByEmailOrThrow(email);
        if (!"ROLE_DRIVER".equalsIgnoreCase(driver.getRole())) {
            throw new ResponseStatusException(BAD_REQUEST, "Only drivers can update vehicle info");
        }
        driver.setVehicleModel(model);
        driver.setLicensePlate(plate);
        driver.setCapacity(capacity);
        return userRepo.save(driver);
    }
    
    public List<DailyStat> getUserStats(LocalDateTime startDate) {
    return userRepo.countNewUsersPerDay(startDate).stream()
        .map(row -> new DailyStat(
            ((java.sql.Date) row[0]).toLocalDate(),
            ((Number) row[1]).longValue()
        ))
        .toList();
}
    
}
