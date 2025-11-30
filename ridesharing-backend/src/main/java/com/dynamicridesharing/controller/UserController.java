// src/main/java/com/dynamicridesharing/controller/UserController.java
package com.dynamicridesharing.controller;

import com.dynamicridesharing.model.User;
import com.dynamicridesharing.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    public UserController(UserService userService) { this.userService = userService; }

    @GetMapping("/me")
    public User me(Principal principal) {
        return userService.findByEmailOrThrow(principal.getName());
    }

    @PutMapping("/vehicle")
    @PreAuthorize("hasRole('DRIVER')")
    public User updateVehicle(Principal principal, @RequestBody Map<String, Object> body) {
        String model = (String) body.get("vehicleModel");
        String plate = (String) body.get("licensePlate");
        Integer capacity = body.get("capacity") == null ? null : ((Number) body.get("capacity")).intValue();
        return userService.updateDriverVehicle(principal.getName(), model, plate, capacity);
    }
}
