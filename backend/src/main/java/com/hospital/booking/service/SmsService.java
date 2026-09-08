package com.hospital.booking.service;

/**
 * SMS/OTP Service interface using Twilio Verify
 * Handles phone validation and OTP delivery via SMS
 */
public interface SmsService {
    
    /**
     * Send OTP via Twilio Verify Service
     * @param phone The phone number (10 digits for India)
     * @return Verification SID if sent successfully
     * @throws IllegalArgumentException if phone number is invalid
     * @throws RuntimeException if sending fails
     */
    String sendOtp(String phone);
    
    /**
     * Verify OTP code submitted by user
     * @param phone The phone number
     * @param code The 6-digit OTP code
     * @return true if valid, false if invalid/expired
     */
    boolean verifyOtp(String phone, String code);
    
    /**
     * Validate if phone number exists and is reachable
     * @param phone The phone number to validate
     * @return true if valid and reachable
     */
    boolean validatePhoneNumber(String phone);
}
