package com.dynamicridesharing.controller;

import com.dynamicridesharing.dto.ReviewRequestDTO;
import com.dynamicridesharing.model.Review;
import com.dynamicridesharing.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_PASSENGER', 'ROLE_DRIVER')")
    public ResponseEntity<Review> submitReview(@RequestBody ReviewRequestDTO request, Principal principal) {
        Review newReview = reviewService.createReview(request, principal.getName());
        return ResponseEntity.ok(newReview);
    }
}
