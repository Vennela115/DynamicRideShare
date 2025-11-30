package com.dynamicridesharing.service;

import com.dynamicridesharing.model.Booking;
import com.dynamicridesharing.model.BookingStatus;
import com.dynamicridesharing.repository.BookingRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ScheduledTasksService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public ScheduledTasksService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    /**
     * This task runs every 15 minutes.
     * It finds all confirmed bookings for rides that are starting between 60 and 75 minutes from now
     * and sends a reminder email.
     */
    @Scheduled(fixedRate = 900000) // 900,000 ms = 15 minutes
    public void sendRideReminders() {
        System.out.println("Checking for upcoming rides to send reminders...");
        LocalDate today = LocalDate.now();
        LocalTime reminderStart = LocalTime.now().plusHours(1);
        LocalTime reminderEnd = reminderStart.plusMinutes(15);

        // Find all confirmed bookings for rides within the reminder window
        List<Booking> upcomingBookings = bookingRepository.findUpcomingBookingsForReminder(
                today,
                reminderStart,
                reminderEnd,
                BookingStatus.CONFIRMED
        );
        
        for (Booking booking : upcomingBookings) {
            notificationService.sendRideReminderEmail(booking);
        }
        System.out.println("Sent " + upcomingBookings.size() + " reminders.");
    }
}
