package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateResponse {

    /** PayU Merchant ID (key). */
    private String key;

    /** Transaction ID generated server-side: appointmentId + "-" + timestamp. */
    private String txnid;

    /** Amount formatted to 2 decimal places (e.g. "500.00"). */
    private String amount;

    /** Product description. */
    private String productinfo;

    /** Payer's first name. */
    private String firstname;

    /** Payer's email. */
    private String email;

    /** Payer's phone. */
    private String phone;

    /**
     * SHA-512 hash computed server-side.
     * Format: SHA512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
     * Empty string when mockMode is true and no credentials are configured.
     */
    private String hash;

    /** PayU checkout URL to POST the form to. */
    private String payuUrl;

    /**
     * When true the frontend should simulate the checkout dialog instead of
     * submitting to the real PayU endpoint.
     */
    private boolean mockMode;
}
