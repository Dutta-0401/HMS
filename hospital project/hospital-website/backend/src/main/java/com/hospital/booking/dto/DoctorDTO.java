package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorDTO {
    private String id;
    private String name;
    private String specialty;
    private BigDecimal fee;
    private String qualification;
    private String experience;
    private String imageUrl;
    private String bio;
    private String hospitalId;
    private String hospitalName;
}
