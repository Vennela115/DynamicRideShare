// src/main/java/com/dynamicridesharing/service/CustomUserDetailsService.java
package com.dynamicridesharing.service;

import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.DisabledException; 

import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepo;

    public CustomUserDetailsService(UserRepository userRepo) { this.userRepo = userRepo; }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User u = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));
                
                // --- THIS IS THE NEW, CRITICAL CHECK ---
        // If the user's enabled flag is false, throw a DisabledException.
        // Spring Security will catch this and prevent the login.
        if (!u.isEnabled()) {
            throw new DisabledException("User account is disabled.");
        }

        // role is already "ROLE_PASSENGER" / "ROLE_DRIVER" / "ROLE_ADMIN"
        var authorities = List.of(new SimpleGrantedAuthority(u.getRole()));

        return new org.springframework.security.core.userdetails.User(
                u.getEmail(), u.getPassword(), authorities
        );
    }
}
