package com.hospital.booking.service.impl;

import com.hospital.booking.service.SmsService;
import com.twilio.Twilio;
import com.twilio.exception.ApiException;
import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;

/**
 * Twilio Verify Service implementation for OTP
 * Production-grade OTP handling with built-in fraud detection
 */
@Service
@Slf4j
public class TwilioSmsService implements SmsService {

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.verify-service-sid}")
    private String verifyServiceSid;

    @Value("${twilio.country-code}")
    private String countryCode;

    @PostConstruct
    public void init() {
        // Initialize Twilio with credentials
        if (!"your_account_sid".equals(accountSid) && !"your_auth_token".equals(authToken)) {
            Twilio.init(accountSid, authToken);
            log.info("Twilio Verify Service initialized successfully");
        } else {
            log.warn("Twilio credentials not configured - OTP service disabled");
        }
    }

    @Override
    public String sendOtp(String phone) {
        try {
            // Validate credentials first
            if ("your_account_sid".equals(accountSid) || "your_auth_token".equals(authToken)
                    || "your_verify_service_sid".equals(verifyServiceSid)) {
                log.warn("Twilio Verify not configured - OTP would be sent to {}", phone);
                return null;
            }

            // Format phone number with country code
            String fullPhoneNumber = formatPhoneNumber(phone);

            // Send OTP via Twilio Verify Service
            Verification verification = Verification.creator(
                    verifyServiceSid,
                    fullPhoneNumber,
                    "sms"
            ).create();

            log.info("OTP verification started for phone ending in {} - SID: {}",
                    phone.substring(Math.max(0, phone.length() - 4)),
                    verification.getSid());

            return verification.getSid();

        } catch (ApiException e) {
            log.error("Twilio Verify error sending OTP to {}: {} - {}",
                    phone.substring(Math.max(0, phone.length() - 4)),
                    e.getCode(),
                    e.getMessage());

            // Common error codes:
            // 20003 - Invalid parameter
            // 20429 - Too many requests (rate limited)
            // 60200 - Invalid phone number for region
            if (e.getCode() == 20003 || e.getCode() == 60200) {
                throw new IllegalArgumentException("Invalid or unreachable phone number. Please check and try again.");
            }
            if (e.getCode() == 20429) {
                throw new RuntimeException("Too many OTP requests. Please try again later.");
            }
            throw new RuntimeException("Failed to send OTP. Please try again later.");

        } catch (Exception e) {
            log.error("Unexpected error sending OTP to {}: {}",
                    phone.substring(Math.max(0, phone.length() - 4)),
                    e.getMessage());
            throw new RuntimeException("Failed to send OTP. Please try again later.");
        }
    }

    @Override
    public boolean verifyOtp(String phone, String code) {
        try {
            // Validate credentials
            if ("your_account_sid".equals(accountSid) || "your_auth_token".equals(authToken)
                    || "your_verify_service_sid".equals(verifyServiceSid)) {
                log.warn("Twilio Verify not configured - would verify {} for {}", code, phone);
                return false;
            }

            // Format phone number
            String fullPhoneNumber = formatPhoneNumber(phone);

            // Verify OTP code via Twilio Verify Service
            VerificationCheck verificationCheck = VerificationCheck.creator(verifyServiceSid)
                    .setTo(fullPhoneNumber)
                    .setCode(code)
                    .create();

            boolean isValid = "approved".equals(verificationCheck.getStatus());

            if (isValid) {
                log.info("OTP verified successfully for phone ending in {}",
                        phone.substring(Math.max(0, phone.length() - 4)));
            } else {
                log.warn("OTP verification failed for phone ending in {} - Status: {}",
                        phone.substring(Math.max(0, phone.length() - 4)),
                        verificationCheck.getStatus());
            }

            return isValid;

        } catch (ApiException e) {
            log.warn("OTP verification error for {}: {} - {}",
                    phone.substring(Math.max(0, phone.length() - 4)),
                    e.getCode(),
                    e.getMessage());

            // 20404 - Verification not found
            // 60200 - Invalid phone number
            if (e.getCode() == 20404 || e.getCode() == 60200) {
                return false;
            }

            return false;

        } catch (Exception e) {
            log.error("Unexpected error verifying OTP for {}: {}",
                    phone.substring(Math.max(0, phone.length() - 4)),
                    e.getMessage());
            return false;
        }
    }

    @Override
    public boolean validatePhoneNumber(String phone) {
        try {
            // Validate credentials
            if ("your_account_sid".equals(accountSid) || "your_auth_token".equals(authToken)) {
                log.warn("Twilio not configured - skipping phone validation for {}", phone);
                return true; // Allow in dev mode
            }

            // Basic format validation
            String cleanPhone = phone.replaceAll("[^0-9]", "");
            if (cleanPhone.length() < 10 || cleanPhone.length() > 15) {
                log.warn("Phone number format invalid: {}", phone);
                return false;
            }

            // For India, validate 10-digit format
            if (cleanPhone.length() == 10 && !cleanPhone.startsWith("0")) {
                // Valid Indian mobile number
                return true;
            }

            // With country code
            if (cleanPhone.length() == 12 && cleanPhone.startsWith("91")) {
                return true;
            }

            return true;

        } catch (Exception e) {
            log.error("Error validating phone {}: {}", phone, e.getMessage());
            return true; // Fail open for availability
        }
    }

    /**
     * Format phone number with country code
     * Converts 10-digit Indian number to +91XXXXXXXXXX
     */
    private String formatPhoneNumber(String phone) {
        // Remove any existing formatting
        String cleanPhone = phone.replaceAll("[^0-9]", "");

        // If already has country code (91)
        if (cleanPhone.startsWith("91")) {
            return "+" + cleanPhone;
        }

        // If starts with 0, remove it (common Indian format)
        if (cleanPhone.startsWith("0")) {
            cleanPhone = cleanPhone.substring(1);
        }

        // Add India country code
        return "+91" + cleanPhone;
    }
}
