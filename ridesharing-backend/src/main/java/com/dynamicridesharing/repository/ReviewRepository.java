package com.dynamicridesharing.repository;

import com.dynamicridesharing.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Finds all review objects for a given reviewee's ID.
     * The naming convention 'findByReviewee_Id' is the most explicit and reliable way
     * to tell Spring Data JPA to look for the 'id' field within the 'reviewee' User object.
     */
    List<Review> findByReviewee_Id(Long revieweeId); // <-- THE KEY CHANGE IS HERE

    /**
     * Calculates the average rating for a specific user.
     * COALESCE ensures we get 0.0 instead of null if there are no reviews.
     */
    @Query("SELECT COALESCE(AVG(r.rating), 0.0) FROM Review r WHERE r.reviewee.id = :revieweeId")
    Double findAverageRatingByRevieweeId(@Param("revieweeId") Long revieweeId);

    /**
     * Counts all reviews for a specific user.
     * This is more explicit than the previous method name.
     */
    long countByReviewee_Id(Long revieweeId); // <-- THE KEY CHANGE IS HERE

    // This method is fine as is
    boolean existsByRideIdAndReviewerId(Long rideId, Long reviewerId);
}
