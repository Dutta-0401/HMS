package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    private String patientName;
    private String hospitalId;
    private String hospitalName;
    private String department;
    private String doctor;
    private String slotDate;
    private String slotTime;
}
