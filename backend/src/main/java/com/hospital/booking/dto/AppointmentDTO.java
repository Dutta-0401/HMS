package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {
    private String id;
    private String doctorId;
    private String doctorName;
    private String doctorSpecialty;
    private String hospitalName;
    private String slotId;
    private String slotDate;
    private String slotTime;
    private String paymentMethod;
    private String status;
    private BigDecimal amount;
    private LocalDateTime createdAt;
}
