package com.dynamicridesharing.dto;

import com.dynamicridesharing.model.DisputeStatus;
import java.time.LocalDateTime;

public class AdminDisputeViewDTO {

    private Long id;
    private Long bookingId;
    private String reportingUserName;
    private String reportingUserEmail;
    private String reason;
    private DisputeStatus status;
    private LocalDateTime createdAt;

    // Getters and Setters for all fields
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }
    public String getReportingUserName() { return reportingUserName; }
    public void setReportingUserName(String name) { this.reportingUserName = name; }
    public String getReportingUserEmail() { return reportingUserEmail; }
    public void setReportingUserEmail(String email) { this.reportingUserEmail = email; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public DisputeStatus getStatus() { return status; }
    public void setStatus(DisputeStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
