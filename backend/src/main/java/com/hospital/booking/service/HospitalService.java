package com.hospital.booking.service;

import com.hospital.booking.dto.HospitalDTO;
import com.hospital.booking.entity.Hospital;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    public List<HospitalDTO> getAllHospitals() {
        return hospitalRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public HospitalDTO getHospitalById(String id) {
        Hospital hospital = hospitalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return toDTO(hospital);
    }

    public List<HospitalDTO> getHospitalsByCity(String city) {
        return hospitalRepository.findByCity(city).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private HospitalDTO toDTO(Hospital hospital) {
        return HospitalDTO.builder()
                .id(hospital.getId())
                .name(hospital.getName())
                .city(hospital.getCity())
                .address(hospital.getAddress())
                .phone(hospital.getPhone())
                .email(hospital.getEmail())
                .imageUrl(hospital.getImageUrl())
                .specialties(hospital.getSpecialties())
                .doctorCount((int) doctorRepository.countByHospitalId(hospital.getId()))
                .build();
    }
}
