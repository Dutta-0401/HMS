package com.hospital.booking.controller;

import com.hospital.booking.dto.AppointmentDTO;
import com.hospital.booking.dto.AppointmentResponse;
import com.hospital.booking.dto.CreateAppointmentRequest;
import com.hospital.booking.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String userId = userDetails.getUsername();
        return ResponseEntity.ok(appointmentService.createAppointment(request, userId));
    }

    @GetMapping("/users/{userId}/appointments")
    public ResponseEntity<List<AppointmentDTO>> getUserAppointments(
            @PathVariable String userId,
            @AuthenticationPrincipal UserDetails userDetails) {
        // Verify user is accessing their own appointments
        // Return 404 instead of 403 to prevent user enumeration
        if (!userDetails.getUsername().equals(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
    }
}
