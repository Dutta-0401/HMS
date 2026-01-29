package com.hospital.booking.controller;

import com.hospital.booking.dto.AuthResponse;
import com.hospital.booking.dto.SendOtpRequest;
import com.hospital.booking.dto.VerifyOtpRequest;
import com.hospital.booking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, Object>> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        String devOtp = authService.sendOtp(request);
        return ResponseEntity.ok(Map.of(
                "ok", true,
                "dev_otp", devOtp  // Remove in production
        ));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        AuthResponse response = authService.verifyOtp(request);
        return ResponseEntity.ok(response);
    }
}
