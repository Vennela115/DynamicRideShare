package com.dynamicridesharing.config;

import com.dynamicridesharing.model.User;
import com.dynamicridesharing.service.UserService; // Assuming your service is here
import com.dynamicridesharing.repository.UserRepository; // Or inject repository directly
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    // It's often cleaner to inject the repository directly for this task
    private final UserRepository userRepository; 
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.default.email}")
    private String adminEmail;

    @Value("${admin.default.password}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Use the repository to check if the admin user exists
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail(adminEmail);
            // Always encode the password
            admin.setPassword(passwordEncoder.encode(adminPassword));
            // Set the role exactly as your security config expects
            admin.setRole("ROLE_ADMIN"); 
            
            userRepository.save(admin);
            
            System.out.println("=============================================");
            System.out.println("Default Admin user created: " + adminEmail);
            System.out.println("=============================================");
        }
    }
}