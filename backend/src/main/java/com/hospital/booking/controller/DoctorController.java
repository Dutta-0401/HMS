package com.hospital.booking.controller;

import com.hospital.booking.dto.DoctorDTO;
import com.hospital.booking.dto.SlotDTO;
import com.hospital.booking.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping("/{id}")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable String id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<SlotDTO>> getDoctorSlots(
            @PathVariable String id,
            @RequestParam(required = false) String date) {
        return ResponseEntity.ok(doctorService.getDoctorSlots(id, date));
    }
}
