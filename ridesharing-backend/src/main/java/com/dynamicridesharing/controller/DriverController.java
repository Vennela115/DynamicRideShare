package com.dynamicridesharing.controller;

import com.dynamicridesharing.dto.VerificationRequestDTO;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/driver")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping("/submit-verification")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public ResponseEntity<User> submitVerification(Principal principal, @RequestBody VerificationRequestDTO request) {
        User updatedDriver = driverService.submitForVerification(principal.getName(), request);
        return ResponseEntity.ok(updatedDriver);
    }
}
