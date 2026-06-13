package com.hospital.booking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateRequest {

    @NotBlank(message = "Appointment ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9_-]{1,100}$", message = "Invalid appointment ID")
    private String appointmentId;

    @NotBlank(message = "First name is required")
    @Pattern(regexp = "^[\\p{L} .'-]{1,100}$", message = "Invalid first name")
    private String firstName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address")
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{7,15}$", message = "Invalid phone number")
    private String phone;
}
