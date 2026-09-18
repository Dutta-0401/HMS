package com.hospital.booking.controller;

import com.hospital.booking.entity.Appointment;
import com.hospital.booking.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * PayU return-URL handler: verifies the response hash server-side and
 * 302-redirects the shopper to the SPA. A forged or mismatched callback
 * must land on the failure page without touching the appointment.
 */
class PaymentControllerTest {

    private static final String KEY = "testkey123";
    private static final String SALT = "testsalt-256-bits-minimum-length-abcdef";
    private static final String FRONTEND = "https://app.example";
    private static final String APPOINTMENT_ID = "appt123";
    private static final String TXNID = APPOINTMENT_ID + "-1758326400000";

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private PaymentController paymentController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        ReflectionTestUtils.setField(paymentController, "payuMid", KEY);
        ReflectionTestUtils.setField(paymentController, "payuSalt", SALT);
        ReflectionTestUtils.setField(paymentController, "frontendUrl", FRONTEND);
    }

    private Appointment pendingAppointment() {
        return Appointment.builder()
                .id(APPOINTMENT_ID)
                .userId("user-1")
                .amount(new BigDecimal("800.00"))
                .status(Appointment.AppointmentStatus.PAYMENT_PENDING)
                .build();
    }

    private Map<String, String> baseParams() {
        Map<String, String> params = new HashMap<>();
        params.put("status", "success");
        params.put("txnid", TXNID);
        params.put("amount", "800.00");
        params.put("productinfo", "Doctor Consultation");
        params.put("firstname", "John");
        params.put("email", "john@example.com");
        params.put("phone", "9999999999");
        return params;
    }

    private String validHash(Map<String, String> params) {
        return PaymentController.computeResponseHash(
                "", params.get("status"), "", "", "", "", "",
                params.get("email"), params.get("firstname"),
                params.get("productinfo"), params.get("amount"),
                params.get("txnid"), KEY, SALT);
    }

    @Test
    void testTxnidParsing() {
        assertEquals(APPOINTMENT_ID, PaymentController.appointmentIdFromTxnid(TXNID));
        assertNull(PaymentController.appointmentIdFromTxnid("no-dash-here".replace("-", "")));
        assertNull(PaymentController.appointmentIdFromTxnid(null));
    }

    @Test
    void testValidSuccessCallbackConfirmsAppointment() {
        Appointment appointment = pendingAppointment();
        when(appointmentRepository.findById(APPOINTMENT_ID)).thenReturn(Optional.of(appointment));

        Map<String, String> params = baseParams();
        params.put("hash", validHash(params));

        ResponseEntity<Void> response = paymentController.payuCallback(params);

        assertEquals(302, response.getStatusCode().value());
        String location = response.getHeaders().getLocation().toString();
        assertTrue(location.startsWith(FRONTEND + "/book-success?"), location);
        assertTrue(location.contains("txnid=" + TXNID), location);
        assertEquals(Appointment.AppointmentStatus.CONFIRMED, appointment.getStatus());
        verify(appointmentRepository, times(1)).save(appointment);
    }

    @Test
    void testForgedHashGoesToFailurePage() {
        Appointment appointment = pendingAppointment();
        when(appointmentRepository.findById(APPOINTMENT_ID)).thenReturn(Optional.of(appointment));

        Map<String, String> params = baseParams();
        params.put("hash", "forged-hash-value");

        ResponseEntity<Void> response = paymentController.payuCallback(params);

        assertEquals(302, response.getStatusCode().value());
        String location = response.getHeaders().getLocation().toString();
        assertTrue(location.startsWith(FRONTEND + "/book-failed?"), location);
        assertEquals(Appointment.AppointmentStatus.PAYMENT_PENDING, appointment.getStatus());
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void testAmountMismatchGoesToFailurePage() {
        Appointment appointment = pendingAppointment();
        when(appointmentRepository.findById(APPOINTMENT_ID)).thenReturn(Optional.of(appointment));

        // Attacker lowers the posted amount but reuses a hash for 800.00
        Map<String, String> params = baseParams();
        params.put("hash", validHash(params));
        params.put("amount", "1.00");

        ResponseEntity<Void> response = paymentController.payuCallback(params);

        String location = response.getHeaders().getLocation().toString();
        assertTrue(location.startsWith(FRONTEND + "/book-failed?"), location);
        verify(appointmentRepository, never()).save(any());
    }

    @Test
    void testUnknownTxnidGoesToFailurePage() {
        when(appointmentRepository.findById(any())).thenReturn(Optional.empty());

        Map<String, String> params = baseParams();
        params.put("hash", validHash(params));

        ResponseEntity<Void> response = paymentController.payuCallback(params);

        assertEquals(302, response.getStatusCode().value());
        assertTrue(response.getHeaders().getLocation().toString()
                .startsWith(FRONTEND + "/book-failed?"));
    }
}
