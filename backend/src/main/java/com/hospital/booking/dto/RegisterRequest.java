package com.hospital.booking.dto;

import com.hospital.booking.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    private User.UserRole role;
    private String hospitalId;  // Only for HOSPITAL_ADMIN
}
