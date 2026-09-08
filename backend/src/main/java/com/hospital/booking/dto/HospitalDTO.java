package com.hospital.booking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDTO {
    private String id;
    private String name;
    private String city;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private List<String> specialties;
}
