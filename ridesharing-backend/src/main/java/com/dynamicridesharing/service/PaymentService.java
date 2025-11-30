package com.dynamicridesharing.service;

import com.dynamicridesharing.model.Payment;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import com.dynamicridesharing.dto.DailyStatDouble;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final UserService userService; // already available in your project

    // ✅ Constructor injection (cleaner & testable)
    public PaymentService(PaymentRepository paymentRepository, UserService userService) {
        this.paymentRepository = paymentRepository;
        this.userService = userService;
    }

    /**
     * Save a payment transaction
     */
    public Payment savePayment(Payment payment) {
        if (payment.getPassengerId() == null || payment.getDriverId() == null) {
            throw new IllegalArgumentException("PassengerId and DriverId must not be null");
        }
        if (payment.getAmount() == null || payment.getAmount() <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than 0");
        }
        return paymentRepository.save(payment);
    }

    /**
     * Get all payment transactions for the current user (passenger or driver)
     */
    public List<Payment> getMyPayments(String email) {
        User user = userService.findByEmailOrThrow(email);

        return paymentRepository.findByPassengerIdOrDriverIdOrderByCreatedAtDesc(user.getId(), user.getId());
    }

    /**
     * Get payments where the current user is a passenger
     */
    public List<Payment> getPassengerPayments(String email) {
        User user = userService.findByEmailOrThrow(email);
        return paymentRepository.findByPassengerIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Get payments where the current user is a driver
     */
    public List<Payment> getDriverPayments(String email) {
        User user = userService.findByEmailOrThrow(email);
        return paymentRepository.findByDriverIdOrderByCreatedAtDesc(user.getId());
    }

    /**
     * Get a single payment by ID
     */
    public Payment getPaymentById(Long paymentId, String email) {
        User user = userService.findByEmailOrThrow(email);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found with ID: " + paymentId));

        // ✅ Ensure only involved users can view the payment
        if (!payment.getPassengerId().equals(user.getId()) && !payment.getDriverId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You are not authorized to view this payment");
        }

        return payment;
    }
    
	    public List<DailyStatDouble> getPaymentStats(LocalDateTime startDate) {
	    return paymentRepository.sumEarningsPerDay(startDate).stream()
		.map(row -> new DailyStatDouble(
		    ((java.sql.Date) row[0]).toLocalDate(),
		    ((Number) row[1]).doubleValue()
		))
		.toList();
	}
}
