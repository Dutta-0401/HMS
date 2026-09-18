package com.hospital.booking.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Bot gate on sign in/up. Network calls to Google are not unit-tested here;
 * these tests pin the safety-critical local behavior.
 */
class CaptchaServiceTest {

    @Test
    void testBlankSecretSkipsVerificationForLocalDev() {
        assertTrue(new CaptchaService("").verify("anything", "127.0.0.1"));
        assertTrue(new CaptchaService("   ").verify(null, null));
        assertTrue(new CaptchaService(null).verify("", null));
    }

    @Test
    void testBlankTokenFailsWhenSecretConfigured() {
        CaptchaService service = new CaptchaService("dummy-secret-for-tests");
        assertFalse(service.verify(null, "127.0.0.1"));
        assertFalse(service.verify("", "127.0.0.1"));
        assertFalse(service.verify("   ", null));
    }
}
