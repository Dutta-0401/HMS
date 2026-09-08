package com.hospital.booking.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Rate limiting filter to prevent brute force attacks on authentication endpoints.
 * Limits requests per IP address within a time window.
 */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    // Configuration
    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_AUTH_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_SIZE_MS = 60_000; // 1 minute

    // Store for tracking requests per IP
    private final Map<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIp(request);
        String path = request.getRequestURI();
        
        // Determine rate limit based on endpoint
        int maxRequests = isAuthEndpoint(path) ? MAX_AUTH_REQUESTS_PER_MINUTE : MAX_REQUESTS_PER_MINUTE;
        String key = clientIp + ":" + (isAuthEndpoint(path) ? "auth" : "general");
        
        if (isRateLimited(key, maxRequests)) {
            log.warn("Rate limit exceeded for IP: {} on path: {}", clientIp, path);
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many requests. Please try again later.\", \"retryAfter\": 60}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    private boolean isAuthEndpoint(String path) {
        return path.startsWith("/api/auth/");
    }

    private String getClientIp(HttpServletRequest request) {
        // Check for forwarded headers (for proxies/load balancers)
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in the chain
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    private synchronized boolean isRateLimited(String key, int maxRequests) {
        long currentTime = System.currentTimeMillis();
        
        // Clean up old entries periodically
        if (currentTime % 10 == 0) {
            cleanupOldEntries(currentTime);
        }
        
        RateLimitEntry entry = requestCounts.get(key);
        
        if (entry == null || currentTime - entry.windowStart > WINDOW_SIZE_MS) {
            // New window
            requestCounts.put(key, new RateLimitEntry(currentTime, new AtomicInteger(1)));
            return false;
        }
        
        int currentCount = entry.count.incrementAndGet();
        return currentCount > maxRequests;
    }

    private void cleanupOldEntries(long currentTime) {
        requestCounts.entrySet().removeIf(entry -> 
            currentTime - entry.getValue().windowStart > WINDOW_SIZE_MS * 2);
    }

    private static class RateLimitEntry {
        final long windowStart;
        final AtomicInteger count;

        RateLimitEntry(long windowStart, AtomicInteger count) {
            this.windowStart = windowStart;
            this.count = count;
        }
    }
}
