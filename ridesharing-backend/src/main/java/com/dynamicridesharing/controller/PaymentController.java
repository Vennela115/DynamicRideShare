package com.dynamicridesharing.controller;

import com.dynamicridesharing.service.BookingService;
import com.dynamicridesharing.dto.PaymentCreateRequest;
import com.dynamicridesharing.dto.PaymentResponse;
import com.dynamicridesharing.dto.BookRideResponse;
import com.dynamicridesharing.model.Payment;
import com.dynamicridesharing.model.User;
import com.dynamicridesharing.repository.PaymentRepository;
import com.dynamicridesharing.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.razorpay.RazorpayClient;
import com.razorpay.Order;
import org.json.JSONObject;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentRepository paymentRepo;

    @Autowired
    private UserService userService;
    
    @Autowired
    private final BookingService bookingService;

    @Value("${razorpay.key_id}")
    private String razorpayKeyId;

    @Value("${razorpay.key_secret}")
    private String razorpayKeySecret;
    
    @Value("${platform.fee.percentage}")
    private Double platformFeePercentage;

    public PaymentController(PaymentRepository paymentRepo,UserService userService, BookingService bookingService) {
        this.paymentRepo = paymentRepo;
        this.userService = userService;
        this.bookingService = bookingService;
    }

    @PostMapping("/create-order")
    @PreAuthorize("hasAnyAuthority('ROLE_PASSENGER','PASSENGER')") 
    public String createOrder(@RequestBody PaymentCreateRequest req) throws Exception {
        // Initialize Razorpay client
        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

       
	JSONObject options = new JSONObject();
	options.put("amount", req.getAmount());
	options.put("currency", "INR");
	options.put("receipt", "txn_" + System.currentTimeMillis());
	options.put("payment_capture", true); // boolean in 1.4.4

	Order order = client.Orders.create(options); // works in 1.4.4

        return order.toString();
    }

    @PostMapping("/capture")
    @PreAuthorize("hasAnyAuthority('ROLE_PASSENGER','PASSENGER')")
    public PaymentResponse capture(@RequestBody PaymentCreateRequest req, Principal principal) {
    
    	String passengerEmail = principal.getName();
    	User currentUser = 	userService.findByEmailOrThrow(principal.getName());
    	
    	// This creates the booking and reduces the ride's seat count.
        BookRideResponse newBooking = bookingService.bookRide(
            passengerEmail,
            req.getRideId(),
            req.getSeats(),
            req.getAmount() // Pass totalFare to the service
        );
    	
        Payment p = new Payment();
        p.setBookingId(req.getBookingId());
        p.setRideId(req.getRideId());
        p.setPassengerId(currentUser.getId());
        p.setDriverId(req.getDriverId());
        p.setAmount(req.getAmount());
          double fee = req.getAmount() * (platformFeePercentage / 100.0);
        p.setPlatformFee(fee);
        p.setProvider("RAZORPAY");
        p.setStatus("SUCCESS");
        p.setProviderRef(req.getProviderRef());

        return new PaymentResponse(paymentRepo.save(p));
    }

    @GetMapping("/history/me")
    @PreAuthorize("hasAnyAuthority('ROLE_PASSENGER','ROLE_DRIVER','PASSENGER','DRIVER')")
    public List<Payment> myHistory(Principal principal) {
        User currentUser = userService.findByEmailOrThrow(principal.getName());
        Long userId = currentUser.getId();
        return paymentRepo.findByPassengerIdOrDriverIdOrderByCreatedAtDesc(userId, userId);
    }
}

