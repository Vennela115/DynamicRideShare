package com.dynamicridesharing.dto;

public class VerificationRequestDTO {
    private String licenseNumber;
    // You can add other text-based fields here if needed, e.g., insurancePolicyNumber

    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
}
