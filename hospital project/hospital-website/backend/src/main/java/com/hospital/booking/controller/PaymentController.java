package com.hospital.booking.controller;

import com.hospital.booking.dto.PaymentInitiateRequest;
import com.hospital.booking.dto.PaymentInitiateResponse;
import com.hospital.booking.entity.Appointment;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.repository.AppointmentRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final AppointmentRepository appointmentRepository;

    @Value("${payu.mid:}")
    private String payuMid;

    @Value("${payu.salt:}")
    private String payuSalt;

    @Value("${payu.env:test}")
    private String payuEnv;

    @Value("${payu.mock-enabled:true}")
    private boolean mockEnabled;

    private static final String PAYU_TEST_URL = "https://test.payumoney.com/mweb/";
    private static final String PAYU_PROD_URL  = "https://secure.payumoney.com/mweb/";

    /**
     * Generates a PayU payment initiation payload with the hash computed server-side.
     *
     * The SALT is kept exclusively in the Railway environment — it is never sent
     * to the browser. The frontend receives a ready-to-submit set of form fields.
     *
     * Amount is fetched from the database; the client-supplied value is ignored to
     * prevent price-tampering attacks.
     */
    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponse> initiatePayment(
            @Valid @RequestBody PaymentInitiateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        String userId = userDetails.getUsername();

        // 1. Load appointment from DB — amount is authoritative here, never from the client
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        // 2. Ownership check — return 404 (not 403) to avoid exposing appointment IDs
        if (!appointment.getUserId().equals(userId)) {
            throw new ResourceNotFoundException("Appointment not found");
        }

        // 3. Require credentials when not in mock mode
        if (!mockEnabled && (payuMid == null || payuMid.isBlank()
                || payuSalt == null || payuSalt.isBlank())) {
            throw new IllegalStateException("PayU gateway credentials are not configured on the server.");
        }

        // 4. Format amount (PayU expects exactly 2 decimal places)
        String amountStr = appointment.getAmount()
                .setScale(2, RoundingMode.HALF_UP)
                .toPlainString();

        // 5. Build txnid server-side so it is tied to the appointment ID
        String txnid = appointment.getId() + "-" + System.currentTimeMillis();
        String productinfo = "Doctor Consultation";
        String payuUrl = "production".equalsIgnoreCase(payuEnv) ? PAYU_PROD_URL : PAYU_TEST_URL;

        // 6. Compute hash — empty string when running in mock mode with no credentials
        boolean credentialsPresent = payuMid != null && !payuMid.isBlank()
                && payuSalt != null && !payuSalt.isBlank();
        String hash = credentialsPresent
                ? computeHash(payuMid, txnid, amountStr, productinfo,
                              request.getFirstName(), request.getEmail(), payuSalt)
                : "";

        return ResponseEntity.ok(PaymentInitiateResponse.builder()
                .key(credentialsPresent ? payuMid : "")
                .txnid(txnid)
                .amount(amountStr)
                .productinfo(productinfo)
                .firstname(request.getFirstName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .hash(hash)
                .payuUrl(payuUrl)
                .mockMode(mockEnabled)
                .build());
    }

    /**
     * PayU request-hash format (SHA-512):
     *   key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
     *
     * udf1-udf5 and the six trailing fields are empty strings, represented as
     * eleven consecutive pipe characters between the email and the SALT.
     */
    private String computeHash(String key, String txnid, String amount,
                               String productinfo, String firstname,
                               String email, String salt) {
        String input = key + "|" + txnid + "|" + amount + "|" + productinfo + "|"
                + firstname + "|" + email + "|||||||||||" + salt;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] bytes = md.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder(128);
            for (byte b : bytes) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-512 unavailable", e);
        }
    }
}
