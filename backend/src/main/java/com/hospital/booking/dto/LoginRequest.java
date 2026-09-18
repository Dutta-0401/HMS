package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {
    private String email;
    private String password;
    private String captchaToken;  // reCAPTCHA response token (verified server-side)
    private String website;  // Honeypot — must stay empty (bots fill it)
}
