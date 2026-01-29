package com.hospital.booking.service;

import com.hospital.booking.dto.*;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;

    private static final int OTP_EXPIRY_MINUTES = 5;

    public String sendOtp(SendOtpRequest request) {
        String phone = request.getPhone();
        
        // Generate 6-digit OTP
        String otp = generateOtp();
        
        // Find or create user
        User user = userRepository.findByPhone(phone)
                .orElseGet(() -> User.builder()
                        .phone(phone)
                        .name("User")
                        .build());
        
        // Save OTP with expiry
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        userRepository.save(user);
        
        // In production, send OTP via SMS service
        log.info("OTP for {}: {}", phone, otp);
        
        // Return OTP for development/testing
        return otp;
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String phone = request.getPhone();
        String otp = request.getOtp();
        
        User user = userRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("User not found. Please request OTP first."));
        
        // Validate OTP
        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        // Check expiry
        if (user.getOtpExpiry() == null || user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }
        
        // Clear OTP after successful verification
        user.setOtp(null);
        user.setOtpExpiry(null);
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
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
