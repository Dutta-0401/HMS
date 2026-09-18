package com.hospital.booking.controller;

import com.hospital.booking.dto.AuthResponse;
import com.hospital.booking.dto.LoginRequest;
import com.hospital.booking.dto.RegisterRequest;
import com.hospital.booking.dto.UserDTO;
import com.hospital.booking.service.AuthService;
import com.hospital.booking.service.CaptchaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final CaptchaService captchaService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        verifyHuman(request.getCaptchaToken(), request.getWebsite(), httpRequest);
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {
        verifyHuman(request.getCaptchaToken(), request.getWebsite(), httpRequest);
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Bot defenses for the auth forms, checked before any credential work:
     * 1. Honeypot — the invisible "website" field must stay empty (bots fill it).
     * 2. reCAPTCHA token — verified with Google (skipped only when no secret
     *    is configured, i.e. local development).
     * Generic message on purpose: no hints about which check tripped.
     */
    private void verifyHuman(String captchaToken, String honeypot, HttpServletRequest httpRequest) {
        if (honeypot != null && !honeypot.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verification failed. Please try again.");
        }
        if (!captchaService.verify(captchaToken, httpRequest.getRemoteAddr())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verification failed. Please try again.");
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userId = auth.getName(); // Returns the username (userId) from UserDetails
        UserDTO user = authService.getCurrentUser(userId);
        return ResponseEntity.ok(user);
    }
}

