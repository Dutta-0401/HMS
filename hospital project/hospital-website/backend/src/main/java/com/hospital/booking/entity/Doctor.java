package com.hospital.booking.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.math.BigDecimal;

@Document(collection = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {

    @Id
    private String id;

    private String name;

    @Indexed
    private String specialty;

    private BigDecimal fee;

    private String qualification;

    private String experience;

    private String imageUrl;

    private String bio;

    @Indexed
    private String hospitalId;
}
