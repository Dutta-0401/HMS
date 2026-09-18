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

    @Value("${frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // PayU endpoints (payumoney.com hosts are retired - use payu.in)
    private static final String PAYU_TEST_URL = "https://test.payu.in/_payment";
    private static final String PAYU_PROD_URL  = "https://secure.payu.in/_payment";

    /**
     * Generates a PayU payment initiation payload with the hash computed server-side.
     *
     * The SALT is kept exclusively in the Render environment — it is never sent
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
     * PayU return-URL handler (surl/furl target).
     *
     * Why this exists: PayU sends the shopper back with an HTTP POST carrying
     * form fields. A static SPA host (Vercel) cannot receive POSTs, so pointing
     * surl/furl at the frontend yields a 405 error page. PayU posts here
     * instead; we verify the response hash with the SALT, update the
     * appointment, and 302-redirect the browser to the SPA with query params
     * the receipt page already understands.
     *
     * Public (no JWT — PayU cannot authenticate). Tamper protection comes from
     * the response-hash check plus the server-side amount comparison.
     */
    @PostMapping(value = "/callback", consumes = "application/x-www-form-urlencoded")
    public ResponseEntity<Void> payuCallback(@RequestParam java.util.Map<String, String> params) {
        String status = params.getOrDefault("status", "").trim().toLowerCase();
        String txnid = params.getOrDefault("txnid", "").trim();
        String receivedHash = params.getOrDefault("hash", "").trim();

        String appointmentId = appointmentIdFromTxnid(txnid);
        Appointment appointment = appointmentId != null
                ? appointmentRepository.findById(appointmentId).orElse(null)
                : null;

        boolean ok = false;
        if (appointment != null && !payuSalt.isBlank()) {
            String expectedHash = computeResponseHash(
                    params.getOrDefault("additionalCharges", ""),
                    status, params.getOrDefault("udf1", ""), params.getOrDefault("udf2", ""),
                    params.getOrDefault("udf3", ""), params.getOrDefault("udf4", ""),
                    params.getOrDefault("udf5", ""), params.getOrDefault("email", ""),
                    params.getOrDefault("firstname", ""), params.getOrDefault("productinfo", ""),
                    params.getOrDefault("amount", ""), txnid);
            // Amount must match the DB value — blocks price-tampering replays
            boolean amountMatches = false;
            try {
                BigDecimal posted = new BigDecimal(params.getOrDefault("amount", "0"));
                amountMatches = appointment.getAmount() != null
                        && appointment.getAmount().setScale(2, RoundingMode.HALF_UP)
                                .compareTo(posted.setScale(2, RoundingMode.HALF_UP)) == 0;
            } catch (NumberFormatException ignored) {
            }
            ok = "success".equals(status)
                    && receivedHash.equalsIgnoreCase(expectedHash)
                    && amountMatches;
        }

        if (ok) {
            appointment.setStatus(Appointment.AppointmentStatus.CONFIRMED);
            appointmentRepository.save(appointment);
            return redirect("/book-success", params, appointment);
        }
        return redirect("/book-failed", params, appointment);
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
        return sha512Hex(input);
    }

    /** txnid is built as {@code appointmentId + "-" + millis} in initiatePayment. */
    static String appointmentIdFromTxnid(String txnid) {
        if (txnid == null) return null;
        int dash = txnid.lastIndexOf('-');
        if (dash <= 0) return null;
        return txnid.substring(0, dash);
    }

    /**
     * PayU response-hash format (SHA-512, reverse order):
     *   [additionalCharges|]SALT|status|||||||||||udf5|udf4|udf3|udf2|udf1|
     *   email|firstname|productinfo|amount|txnid|key
     * additionalCharges is present only for some modes (EMI/cashcard).
     */
    static String computeResponseHash(String additionalCharges, String status,
                                      String udf1, String udf2, String udf3,
                                      String udf4, String udf5, String email,
                                      String firstname, String productinfo,
                                      String amount, String txnid, String key,
                                      String salt) {
        String core = salt + "|" + status + "|||||||||||"
                + udf5 + "|" + udf4 + "|" + udf3 + "|" + udf2 + "|" + udf1 + "|"
                + email + "|" + firstname + "|" + productinfo + "|"
                + amount + "|" + txnid + "|" + key;
        String input = (additionalCharges != null && !additionalCharges.isBlank())
                ? additionalCharges + "|" + core
                : core;
        return sha512Hex(input);
    }

    private String computeResponseHash(String additionalCharges, String status,
                                       String udf1, String udf2, String udf3,
                                       String udf4, String udf5, String email,
                                       String firstname, String productinfo,
                                       String amount, String txnid) {
        return computeResponseHash(additionalCharges, status, udf1, udf2, udf3,
                udf4, udf5, email, firstname, productinfo, amount, txnid,
                payuMid, payuSalt);
    }

    private ResponseEntity<Void> redirect(String path,
                                          java.util.Map<String, String> params,
                                          Appointment appointment) {
        String amount = appointment != null && appointment.getAmount() != null
                ? appointment.getAmount().setScale(2, RoundingMode.HALF_UP).toPlainString()
                : params.getOrDefault("amount", "0");
        String query = "status=" + urlEncode(params.getOrDefault("status", ""))
                + "&txnid=" + urlEncode(params.getOrDefault("txnid", ""))
                + "&amount=" + urlEncode(amount)
                + "&firstname=" + urlEncode(params.getOrDefault("firstname", ""))
                + "&email=" + urlEncode(params.getOrDefault("email", ""))
                + "&productinfo=" + urlEncode(params.getOrDefault("productinfo", ""));
        String base = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
        return ResponseEntity.status(302)
                .header("Location", base + path + "?" + query)
                .build();
    }

    private static String urlEncode(String value) {
        try {
            return java.net.URLEncoder.encode(value == null ? "" : value, StandardCharsets.UTF_8);
        } catch (Exception e) {
            return "";
        }
    }

    private static String sha512Hex(String input) {
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
