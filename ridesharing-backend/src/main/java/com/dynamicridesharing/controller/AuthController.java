// src/main/java/com/dynamicridesharing/controller/AuthController.java
package com.dynamicridesharing.controller;

import com.dynamicridesharing.config.JwtUtil;
import com.dynamicridesharing.dto.*;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.UserRepository;
import com.dynamicridesharing.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import com.dynamicridesharing.service.NotificationService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserService userService;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    public AuthController(AuthenticationManager authManager, JwtUtil jwtUtil, UserService userService, UserRepository userRepo, NotificationService notificationService) {
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userService = userService;
        this.userRepo = userRepo;
        this.notificationService = notificationService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        User saved = userService.register(req);
        saved.setPassword(null); // don’t leak password
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        UserDetails principal = (UserDetails) auth.getPrincipal();

        User u = userRepo.findByEmail(principal.getUsername()).orElseThrow();
	notificationService.sendLoginNotificationEmail(u);
        String token = jwtUtil.generateToken(u.getEmail(), u.getRole());
        return ResponseEntity.ok(new AuthResponse(token, u.getRole(), u.getName()));
    }

    // ✅ Separate admin login
    @PostMapping("/admin/login")
    public ResponseEntity<AuthResponse> adminLogin(@RequestBody LoginRequest req) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
        );
        UserDetails principal = (UserDetails) auth.getPrincipal();

        User u = userRepo.findByEmail(principal.getUsername()).orElseThrow();

        String role = String.valueOf(u.getRole());
        if (!"ADMIN".equalsIgnoreCase(role) && !"ROLE_ADMIN".equalsIgnoreCase(role)) {
            throw new ResponseStatusException(BAD_REQUEST, "Only admins can perform this action");
        }
        
        

        String token = jwtUtil.generateToken(u.getEmail(), u.getRole());
        return ResponseEntity.ok(new AuthResponse(token, u.getRole(), u.getName()));
    }

    // ✅ NEW: Get logged-in user profile
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        User user = userRepo.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResponseStatusException(BAD_REQUEST, "User not found"));

        // Don’t expose password
        UserProfileResponse profile = new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );

        return ResponseEntity.ok(profile);
    }
}
