package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.VerificationRequestDTO;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.model.VerificationStatus;
import com.dynamicridesharing.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DriverService {

    private final UserRepository userRepository;
    private final UserService userService; // To find the user by email

    public DriverService(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @Transactional
    public User submitForVerification(String driverEmail, VerificationRequestDTO request) {
        User driver = userService.findByEmailOrThrow(driverEmail);
        
        driver.setLicenseNumber(request.getLicenseNumber());
        driver.setVerificationStatus(VerificationStatus.PENDING); // Update status for admin review
        
        return userRepository.save(driver);
    }
}
