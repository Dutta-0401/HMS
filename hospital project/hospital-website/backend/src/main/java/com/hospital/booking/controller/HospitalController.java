package com.hospital.booking.controller;

import com.hospital.booking.dto.DoctorDTO;
import com.hospital.booking.dto.HospitalDTO;
import com.hospital.booking.service.DoctorService;
import com.hospital.booking.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@RequiredArgsConstructor
public class HospitalController {

    private final HospitalService hospitalService;
    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<HospitalDTO>> getAllHospitals() {
        return ResponseEntity.ok(hospitalService.getAllHospitals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalDTO> getHospitalById(@PathVariable String id) {
        return ResponseEntity.ok(hospitalService.getHospitalById(id));
    }

    @GetMapping("/{id}/doctors")
    public ResponseEntity<List<DoctorDTO>> getDoctorsByHospital(@PathVariable String id) {
        return ResponseEntity.ok(doctorService.getDoctorsByHospital(id));
    }
}
