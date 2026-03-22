package com.hospital.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "hospitals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hospital {

    @Id
    private String id;

    private String name;

    @Indexed
    private String city;

    private String address;

    private String phone;

    private String email;

    private String imageUrl;

    @Builder.Default
    private List<String> departments = new ArrayList<>();

    @Builder.Default
    private List<Doctor> doctors = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Doctor {
        private String name;
        private String department;
    }

    public List<String> getSpecialties() {
        return departments;
    }
}
