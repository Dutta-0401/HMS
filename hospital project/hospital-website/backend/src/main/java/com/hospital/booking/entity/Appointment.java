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

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    private String id;

    @Indexed
    private String userId;

    @Indexed
    private String doctorId;

    @Indexed(unique = true)
    private String slotId;

    @Indexed
    private String slotDate;

    private String slotTime;

    private PaymentMethod paymentMethod;

    private AppointmentStatus status;

    private BigDecimal amount;

    private String razorpayOrderId;

    private String razorpayPaymentId;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum PaymentMethod {
        ONLINE, PAY_AT_HOSPITAL
    }

    public enum AppointmentStatus {
        PENDING, PAYMENT_PENDING, CONFIRMED, CANCELLED, COMPLETED
    }
}
