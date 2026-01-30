package com.hospital.booking.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateAppointmentRequest {
    
    @NotBlank(message = "Doctor ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9_-]{1,50}$", message = "Invalid doctor ID format")
    private String doctorId;
    
    @NotBlank(message = "Slot ID is required")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+-\\d{4}-\\d{2}-\\d{2}-[0-6]$", message = "Invalid slot ID format")
    private String slotId;
    
    @NotNull(message = "Payment method is required")
    @Pattern(regexp = "^(online|pay_at_hospital)$", message = "Invalid payment method")
    private String paymentMethod;
}
