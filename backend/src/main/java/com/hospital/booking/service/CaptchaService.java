package com.hospital.booking.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * Verifies Google reCAPTCHA tokens with the siteverify API so only humans
 * get through the sign in/up forms. Bots that POST directly to the API
 * without a valid token are rejected.
 *
 * If no secret is configured (local development), verification is skipped
 * with a loud warning — production MUST set RECAPTCHA_SECRET, otherwise
 * the forms accept submissions without any bot check.
 */
@Service
@Slf4j
public class CaptchaService {

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private final String secret;

    public CaptchaService(@Value("${recaptcha.secret:}") String secret) {
        this.secret = secret == null ? "" : secret.trim();
    }

    /**
     * @param token    the g-recaptcha-response token from the client (one-time use)
     * @param remoteIp caller IP for extra verification (may be null)
     * @return true when the token verifies, or when no secret is configured (dev only)
     */
    public boolean verify(String token, String remoteIp) {
        if (secret.isBlank()) {
            log.warn("RECAPTCHA_SECRET is not configured - captcha verification SKIPPED. "
                    + "Set it in production or bots can use the auth endpoints freely.");
            return true;
        }
        if (token == null || token.isBlank()) {
            return false;
        }
        try {
            String body = "secret=" + URLEncoder.encode(secret, StandardCharsets.UTF_8)
                    + "&response=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                    + (remoteIp != null && !remoteIp.isBlank()
                            ? "&remoteip=" + URLEncoder.encode(remoteIp, StandardCharsets.UTF_8) : "");
            HttpURLConnection connection =
                    (HttpURLConnection) new URL(VERIFY_URL).openConnection();
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            try (OutputStream out = connection.getOutputStream()) {
                out.write(body.getBytes(StandardCharsets.UTF_8));
            }
            if (connection.getResponseCode() != 200) {
                log.warn("reCAPTCHA siteverify returned HTTP {}", connection.getResponseCode());
                return false;
            }
            String response = new String(connection.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
            // Minimal JSON check without a parser dependency: {"success": true, ...}
            return response.replaceAll("\\s", "").contains("\"success\":true");
        } catch (Exception e) {
            log.warn("reCAPTCHA verification failed: {}", e.getMessage());
            return false;
        }
    }
}
