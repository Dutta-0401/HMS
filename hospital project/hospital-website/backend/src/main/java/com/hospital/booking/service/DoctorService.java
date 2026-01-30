package com.hospital.booking.service;

import com.hospital.booking.dto.DoctorDTO;
import com.hospital.booking.dto.SlotDTO;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.Hospital;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.repository.AppointmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final HospitalRepository hospitalRepository;

    private static final String[] SLOT_TIMES = {"09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"};

    public List<DoctorDTO> getDoctorsByHospital(String hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DoctorDTO getDoctorById(String id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));
        return toDTO(doctor);
    }

    public List<SlotDTO> getDoctorSlots(String doctorId, String date) {
        // Validate doctor exists
        doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        // Validate date format (YYYY-MM-DD) and reasonable range
        String slotDate;
        if (date != null) {
            if (!date.matches("^\\d{4}-\\d{2}-\\d{2}$")) {
                throw new IllegalArgumentException("Invalid date format");
            }
            try {
                LocalDate parsedDate = LocalDate.parse(date);
                // Only allow booking up to 90 days in advance
                if (parsedDate.isBefore(LocalDate.now()) || parsedDate.isAfter(LocalDate.now().plusDays(90))) {
                    throw new IllegalArgumentException("Date must be within next 90 days");
                }
                slotDate = date;
            } catch (Exception e) {
                throw new IllegalArgumentException("Invalid date");
            }
        } else {
            slotDate = LocalDate.now().toString();
        }
        
        // Get booked slots for this doctor on this date
        Set<String> bookedSlotIds = appointmentRepository.findByDoctorIdAndSlotDate(doctorId, slotDate)
                .stream()
                .map(apt -> apt.getSlotId())
                .collect(Collectors.toSet());

        // Generate slots
        List<SlotDTO> slots = new ArrayList<>();
        for (int i = 0; i < SLOT_TIMES.length; i++) {
            String slotId = doctorId + "-" + slotDate + "-" + i;
            boolean isAvailable = !bookedSlotIds.contains(slotId);
            
            slots.add(SlotDTO.builder()
                    .id(slotId)
                    .time(SLOT_TIMES[i])
                    .available(isAvailable)
                    .build());
        }
        
        return slots;
    }

    private DoctorDTO toDTO(Doctor doctor) {
        // Fetch hospital name using hospitalId
        String hospitalName = hospitalRepository.findById(doctor.getHospitalId())
                .map(Hospital::getName)
                .orElse("Unknown Hospital");

        return DoctorDTO.builder()
                .id(doctor.getId())
                .name(doctor.getName())
                .specialty(doctor.getSpecialty())
                .fee(doctor.getFee())
                .qualification(doctor.getQualification())
                .experience(doctor.getExperience())
                .imageUrl(doctor.getImageUrl())
                .bio(doctor.getBio())
                .hospitalId(doctor.getHospitalId())
                .hospitalName(hospitalName)
                .build();
    }
}
