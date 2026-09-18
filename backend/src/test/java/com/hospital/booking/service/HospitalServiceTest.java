package com.hospital.booking.service;

import com.hospital.booking.dto.HospitalDTO;
import com.hospital.booking.entity.Hospital;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.HospitalRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Hospital cards must show the real number of doctors linked to each
 * hospital — never a fabricated number derived from specialties.
 */
class HospitalServiceTest {

    @Mock
    private HospitalRepository hospitalRepository;

    @Mock
    private DoctorRepository doctorRepository;

    @InjectMocks
    private HospitalService hospitalService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    private Hospital hospital(String id, String name, List<String> departments) {
        return Hospital.builder()
                .id(id)
                .name(name)
                .city("Testville")
                .departments(departments)
                .build();
    }

    @Test
    void testDoctorCountComesFromRepositoryNotSpecialties() {
        Hospital withDoctors = hospital("h1", "Busy Hospital", List.of());
        Hospital withoutDoctors = hospital("h2", "Quiet Hospital", List.of("General Medicine"));

        when(hospitalRepository.findAll()).thenReturn(List.of(withDoctors, withoutDoctors));
        when(doctorRepository.countByHospitalId("h1")).thenReturn(3L);
        when(doctorRepository.countByHospitalId("h2")).thenReturn(0L);

        List<HospitalDTO> result = hospitalService.getAllHospitals();

        assertEquals(2, result.size());
        // 0 specialties but 3 real doctors -> 3 (old code showed 0)
        assertEquals(3, result.get(0).getDoctorCount());
        // 1 specialty but 0 real doctors -> 0 (old code showed 3)
        assertEquals(0, result.get(1).getDoctorCount());
    }

    @Test
    void testSingleHospitalIncludesDoctorCount() {
        Hospital hospital = hospital("h9", "Solo Clinic", List.of("Dermatology"));
        when(hospitalRepository.findById("h9")).thenReturn(java.util.Optional.of(hospital));
        when(doctorRepository.countByHospitalId("h9")).thenReturn(2L);

        HospitalDTO dto = hospitalService.getHospitalById("h9");

        assertEquals(2, dto.getDoctorCount());
        verify(doctorRepository, times(1)).countByHospitalId("h9");
    }
}
