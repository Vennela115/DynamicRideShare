package com.dynamicridesharing.service;

import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.model.Ride;
import com.dynamicridesharing.model.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.springframework.core.io.ClassPathResource; 

@Service
public class NotificationService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    public NotificationService(JavaMailSender mailSender, TemplateEngine templateEngine) {
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

     @Async
    public void sendWelcomeEmail(User user) {
        try {
            Context context = new Context();
            context.setVariable("name", user.getName());
            // Provide a URL for the login button in the template
            context.setVariable("loginUrl", "http://localhost:5173/passenger/login"); // Or your main login URL
            
            String htmlContent = templateEngine.process("welcome-email", context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8"); // true = multipart

            helper.setTo(user.getEmail());
            helper.setSubject("Welcome to Dynamic Ride Sharing!");
            helper.setText(htmlContent, true);

            // --- THIS IS THE NEW LOGIC TO ATTACH THE IMAGE ---
            // 1. Load the image file from the classpath (src/main/resources)
            ClassPathResource image = new ClassPathResource("static/images/logo-banner.jpeg");
            
            // 2. Add it as an inline attachment with the Content-ID 'logoImage'
            helper.addInline("logoImage", image);
            // --------------------------------------------------

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            System.err.println("Failed to send welcome email with image: " + e.getMessage());
        }
    }
    

       @Async
    public void sendBookingConfirmationEmails(Booking booking) {
        String passengerSubject = "Your Ride Booking is Confirmed!";
        String driverSubject = "A New Passenger Has Booked Your Ride!";
        String passengerDashboardUrl = "http://localhost:5173/my-bookings";
        String driverDashboardUrl = "http://localhost:5173/my-rides";

        // --- Create Context for Passenger ---
        Context passengerContext = new Context();
        passengerContext.setVariable("subject", passengerSubject);
        passengerContext.setVariable("recipientName", booking.getPassenger().getName());
        passengerContext.setVariable("message", "Payment was successful and your ride is confirmed. Here are the details:");
        passengerContext.setVariable("dashboardUrl", passengerDashboardUrl);
        addBookingDetailsToContext(passengerContext, booking);
        
        sendTemplatedEmailWithAttachment(
            booking.getPassenger().getEmail(),
            passengerSubject,
            "booking-confirmation",
            passengerContext,
            "confirmationImage",
            "static/images/PaymentDoneSuccess.jpeg"
        );

        // --- Create Context for Driver ---
        Context driverContext = new Context();
        driverContext.setVariable("subject", driverSubject);
        driverContext.setVariable("recipientName", booking.getRide().getDriver().getName());
        driverContext.setVariable("message", "A new passenger has booked your upcoming ride. Here are the details:");
        driverContext.setVariable("dashboardUrl", driverDashboardUrl);
        addBookingDetailsToContext(driverContext, booking);

        sendTemplatedEmailWithAttachment(
            booking.getRide().getDriver().getEmail(),
            driverSubject,
            "booking-confirmation",
            driverContext,
            "confirmationImage",
            "static/images/PaymentDoneSuccess.jpeg"
        );
    }


    @Async
public void sendRideCancellationEmail(Ride ride, User recipient) {
    Context context = new Context();
    context.setVariable("recipientName", recipient.getName());
    context.setVariable("rideRoute", ride.getSource() + " → " + ride.getDestination());
    context.setVariable("rideDate", ride.getDate().toString());
    context.setVariable("driverName", ride.getDriver().getName());
    context.setVariable("dashboardUrl", "http://localhost:5173/my-bookings");
    
    // Use the powerful helper to send the email with the image
    sendTemplatedEmailWithAttachment(
        recipient.getEmail(),
        "Important: Your Ride Has Been Cancelled",
        "ride-cancellation",
        context,
        "cancellationImage",
        "static/images/rideCancelled.png" 
    );
}
    
     @Async
    public void sendRideReminderEmail(Booking booking) {
        try {
            Context context = new Context();
            context.setVariable("recipientName", booking.getPassenger().getName());
            context.setVariable("rideRoute", booking.getRide().getSource() + " → " + booking.getRide().getDestination());
            context.setVariable("rideDateTime", booking.getRide().getDate().toString() + " at " + booking.getRide().getTime().toString());
            context.setVariable("driverName", booking.getRide().getDriver().getName());
            context.setVariable("vehicleInfo", booking.getRide().getDriver().getVehicleModel() + " (" + booking.getRide().getDriver().getLicensePlate() + ")");
            context.setVariable("dashboardUrl", "http://localhost:5173/my-bookings");

            String htmlContent = templateEngine.process("ride-reminder", context);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(booking.getPassenger().getEmail());
            helper.setSubject("Reminder: Your ride is in 1 hour!");
            helper.setText(htmlContent, true);

            // Attach the reminder image
            helper.addInline("reminderImage", new ClassPathResource("static/images/Ride_remainder.jpeg"));

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Failed to send reminder email with image: " + e.getMessage());
        }
    }


    private void addBookingDetailsToContext(Context context, Booking booking) {
        context.setVariable("rideInfo", booking.getRide().getSource() + " → " + booking.getRide().getDestination());
        context.setVariable("rideDate", booking.getRide().getDate().toString());
        context.setVariable("rideTime", booking.getRide().getTime().toString());
        context.setVariable("passengerName", booking.getPassenger().getName());
        context.setVariable("driverName", booking.getRide().getDriver().getName());
        context.setVariable("seatsBooked", booking.getSeatsBooked());
    }

    private void sendEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            // --- THIS IS THE FIX: The constructor arguments are now correct ---
            // MimeMessageHelper(message, isMultipart, encoding)
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
    
    @Async
	public void sendLoginNotificationEmail(User user) {
	    Context context = new Context();
	    context.setVariable("name", user.getName());

	    boolean isDriver = "ROLE_DRIVER".equalsIgnoreCase(user.getRole());
	    boolean isPassenger = "ROLE_PASSENGER".equalsIgnoreCase(user.getRole());

	    // Set role flags for the template's th:if conditions
	    context.setVariable("isDriver", isDriver);
	    context.setVariable("isPassenger", isPassenger);

	    // Set the relevant URLs for the buttons
	    if (isDriver) {
		context.setVariable("postRideUrl", "http://localhost:5173/post-ride");
		context.setVariable("myRidesUrl", "http://localhost:5173/my-rides");
	    }
	    if (isPassenger) {
		context.setVariable("searchUrl", "http://localhost:5173/search-rides");
		context.setVariable("bookingsUrl", "http://localhost:5173/my-bookings");
	    }
	    
	    sendTemplatedEmailWithAttachment(
		user.getEmail(),
		"Security Alert: New Login to Your Account",
		"login-notification",
		context,
		"loginImage",
		"static/images/loginImage.jpeg" // Assumes this is your image file name
	    );
	}
	
	 // --- THE MISSING HELPER METHOD ---
    private void sendTemplatedEmailWithAttachment(String to, String subject, String templateName, Context context, String imageCid, String imagePath) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            String htmlContent = templateEngine.process(templateName, context);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            helper.addInline(imageCid, new ClassPathResource(imagePath));
            
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Failed to send templated email with attachment: " + e.getMessage());
        }
    }
	    
}
