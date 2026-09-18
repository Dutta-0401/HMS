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
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Rate limiting filter to prevent brute force attacks on authentication endpoints.
 * Limits requests per IP address within a time window.
 * Uses a sliding window algorithm with background cleanup.
 */
@Component
@Slf4j
public class RateLimitFilter extends OncePerRequestFilter {

    // Configuration
    private static final int MAX_REQUESTS_PER_MINUTE = 10;
    private static final int MAX_AUTH_REQUESTS_PER_MINUTE = 5;
    private static final long WINDOW_SIZE_MS = 60_000; // 1 minute
    private static final long CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

    // Store for tracking requests per IP: key -> {windowStart, count}
    private final Map<String, RateLimitEntry> requestCounts = new ConcurrentHashMap<>();

    // Scheduled executor for periodic cleanup
    private final ScheduledExecutorService cleanupScheduler = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "rate-limit-cleanup");
        t.setDaemon(true);
        return t;
    });

    public RateLimitFilter() {
        // Schedule periodic cleanup
        cleanupScheduler.scheduleAtFixedRate(
            this::cleanupOldEntries,
            CLEANUP_INTERVAL_MS,
            CLEANUP_INTERVAL_MS,
            TimeUnit.MILLISECONDS
        );
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIp(request);
        String path = request.getRequestURI();

        // Never rate-limit health probes (Render) or public health endpoint
        if (isHealthEndpoint(path)) {
            filterChain.doFilter(request, response);
            return;
        }
        
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

    private boolean isHealthEndpoint(String path) {
        return path.equals("/api/health")
                || path.equals("/health")
                || path.startsWith("/actuator/");
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

    private boolean isRateLimited(String key, int maxRequests) {
        long currentTime = System.currentTimeMillis();
        
        RateLimitEntry entry = requestCounts.computeIfAbsent(key, k -> new RateLimitEntry(currentTime, new AtomicInteger(0)));
        
        // Check if we're in a new window
        if (currentTime - entry.windowStart.get() > WINDOW_SIZE_MS) {
            // Try to atomically move to new window
            long oldWindow = entry.windowStart.get();
            if (entry.windowStart.compareAndSet(oldWindow, currentTime)) {
                // Successfully moved to new window, reset count
                entry.count.set(1);
                return false;
            }
            // Another thread already moved the window, fall through to increment
        }
        
        int currentCount = entry.count.incrementAndGet();
        return currentCount > maxRequests;
    }

    private void cleanupOldEntries() {
        long currentTime = System.currentTimeMillis();
        long cutoff = currentTime - WINDOW_SIZE_MS * 2;
        
        requestCounts.entrySet().removeIf(e -> e.getValue().windowStart.get() < cutoff);
        
        if (log.isDebugEnabled()) {
            log.debug("Rate limit cleanup: {} entries remaining", requestCounts.size());
        }
    }

    @Override
    public void destroy() {
        cleanupScheduler.shutdown();
        try {
            if (!cleanupScheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                cleanupScheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            cleanupScheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    private static class RateLimitEntry {
        final AtomicLong windowStart;
        final AtomicInteger count;

        RateLimitEntry(long windowStart, AtomicInteger count) {
            this.windowStart = new AtomicLong(windowStart);
            this.count = count;
        }
    }
}