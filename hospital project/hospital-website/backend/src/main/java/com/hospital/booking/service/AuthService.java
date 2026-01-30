package com.hospital.booking.service;

import com.hospital.booking.dto.*;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final SmsService smsService;

    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_OTP_ATTEMPTS = 3;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    public String sendOtp(SendOtpRequest request) {
        String phone = request.getPhone();
        
        // Validate phone number first
        if (!smsService.validatePhoneNumber(phone)) {
            throw new IllegalArgumentException("Invalid phone number format. Please enter a valid 10-digit Indian number.");
        }
        
        // Send OTP via Twilio Verify Service
        try {
            String verificationSid = smsService.sendOtp(phone);
            if (verificationSid == null) {
                throw new RuntimeException("Failed to send OTP. Please try again later.");
            }
            
            // Find or create user
            User user = userRepository.findByPhone(phone)
                    .orElseGet(() -> User.builder()
                            .phone(phone)
                            .name("User")
                            .build());
            
            // Store verification SID for later verification
            user.setVerificationSid(verificationSid);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
            userRepository.save(user);
            
            log.info("OTP sent successfully to phone ending in {}", phone.substring(Math.max(0, phone.length() - 4)));
            
            return "OTP sent successfully to your phone"; // Never return the OTP
            
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid or unreachable phone number. Please verify your number.");
        } catch (RuntimeException e) {
            throw new RuntimeException("Failed to send OTP. Please try again later.");
        }
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String phone = request.getPhone();
        String otp = request.getOtp();
        
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found. Please request OTP first."));
        
        // Check if account is locked due to too many attempts
        if (user.getOtpLockedUntil() != null && user.getOtpLockedUntil().isAfter(LocalDateTime.now())) {
            throw new RuntimeException("Too many failed attempts. Account locked. Try again later.");
        }
        
        // Check expiry first
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        
        // Verify OTP via Twilio Verify Service
        boolean isValid = false;
        try {
            if (user.getVerificationSid() != null) {
                isValid = smsService.verifyOtp(phone, otp);
            }
        } catch (Exception e) {
            log.error("Error verifying OTP: {}", e.getMessage());
        }
        
        if (!isValid) {
            // Increment failed attempts
            int attempts = (user.getOtpAttempts() != null ? user.getOtpAttempts() : 0) + 1;
            user.setOtpAttempts(attempts);
            
            if (attempts >= MAX_OTP_ATTEMPTS) {
                // Lock account for 15 minutes after max attempts
                user.setOtpLockedUntil(LocalDateTime.now().plusMinutes(15));
                user.setVerificationSid(null);
                user.setOtpExpiry(null);
                userRepository.save(user);
                throw new RuntimeException("Too many failed attempts. Account locked for 15 minutes.");
            }
            
            userRepository.save(user);
            throw new RuntimeException("Invalid OTP. " + (MAX_OTP_ATTEMPTS - attempts) + " attempts remaining.");
        }
        
        // Clear verification and reset attempts after successful verification
        user.setVerificationSid(null);
        user.setOtpExpiry(null);
        user.setOtpAttempts(0);
        user.setOtpLockedUntil(null);
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId(), user.getPhone());
        
        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .phone(user.getPhone())
                .email(user.getEmail())
                .build();
        
        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    private String generateOtp() {
        // Use SecureRandom for cryptographically strong OTP
        int otp = 100000 + SECURE_RANDOM.nextInt(900000);
        return String.valueOf(otp);
    }
}
