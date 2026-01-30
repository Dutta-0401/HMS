package com.hospital.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String phone;

    private String name;

    private String email;

    private String otp;

    private LocalDateTime otpExpiry;

    // Twilio Verify Service SID for OTP verification
    private String verificationSid;

    // OTP attempt tracking for brute force prevention
    @Builder.Default
    private Integer otpAttempts = 0;

    private LocalDateTime otpLockedUntil;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
