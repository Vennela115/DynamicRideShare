package com.dynamicridesharing.service;

import com.dynamicridesharing.dto.ReviewRequestDTO; // We'll create this DTO
import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.model.Review;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.BookingRepository;
import com.dynamicridesharing.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepo, BookingRepository bookingRepo, UserService userService) {
        this.reviewRepository = reviewRepo;
        this.bookingRepository = bookingRepo;
        this.userService = userService;
    }

    @Transactional
    public Review createReview(ReviewRequestDTO request, String reviewerEmail) {
        User reviewer = userService.findByEmailOrThrow(reviewerEmail);
        
        // Find the booking to ensure the reviewer was actually on the ride
        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));

        // Business Logic Checks
        // 1. Check if the ride is completed
        if (booking.getRide().getDate().isAfter(java.time.LocalDate.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You can only review rides after they are completed.");
        }
        
        // 2. Check if the reviewer is either the passenger or the driver of this booking
        boolean isPassenger = booking.getPassenger().getId().equals(reviewer.getId());
        boolean isDriver = booking.getRide().getDriver().getId().equals(reviewer.getId());
        if (!isPassenger && !isDriver) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You were not part of this ride.");
        }

        // 3. Determine who is being reviewed
        User reviewee = isPassenger ? booking.getRide().getDriver() : booking.getPassenger();

        // 4. Prevent duplicate reviews
        if (reviewRepository.existsByRideIdAndReviewerId(booking.getRide().getId(), reviewer.getId())) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already submitted a review for this ride.");
        }

        // All checks passed, create and save the review
        Review review = new Review();
        review.setRide(booking.getRide());
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setCreatedAt(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }

    public double getAverageRatingForUser(Long userId) {
    // This is unchanged, as the method name in the repo is the same
    return reviewRepository.findAverageRatingByRevieweeId(userId);
	}

	public long getReviewCountForUser(Long userId) {
	    // Call the new, more explicit method name
	    return reviewRepository.countByReviewee_Id(userId);
	}
}
