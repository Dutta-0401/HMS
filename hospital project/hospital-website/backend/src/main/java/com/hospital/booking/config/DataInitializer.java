package com.hospital.booking.config;

import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.Hospital;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() == 0) {
            initializeData();
        }
    }

    private void initializeData() {
        log.info("Initializing sample data...");

        // Create hospitals
        Hospital hospital1 = Hospital.builder()
                .id("h1")
                .name("City Health Center")
                .city("Metroville")
                .address("123 Main Street, Metroville")
                .phone("+91 9876543210")
                .email("info@cityhealthcenter.com")
                .specialties(Arrays.asList("Cardiology", "Dermatology", "Neurology"))
                .build();
        hospitalRepository.save(hospital1);

        Hospital hospital2 = Hospital.builder()
                .id("h2")
                .name("Green Valley Hospital")
                .city("Lakeview")
                .address("456 Park Avenue, Lakeview")
                .phone("+91 9876543211")
                .email("info@greenvalleyhospital.com")
                .specialties(Arrays.asList("Pediatrics", "Orthopedics", "ENT"))
                .build();
        hospitalRepository.save(hospital2);

        Hospital hospital3 = Hospital.builder()
                .id("h3")
                .name("Sunrise Medical Center")
                .city("Metroville")
                .address("789 Health Boulevard, Metroville")
                .phone("+91 9876543212")
                .email("info@sunrisemedical.com")
                .specialties(Arrays.asList("Oncology", "Gastroenterology", "Pulmonology"))
                .build();
        hospitalRepository.save(hospital3);

        // Create doctors for Hospital 1
        doctorRepository.save(Doctor.builder()
                .id("d1")
                .name("Dr. Asha Kumar")
                .specialty("Cardiology")
                .fee(new BigDecimal("500"))
                .qualification("MBBS, MD (Cardiology)")
                .experience("15 years")
                .bio("Experienced cardiologist specializing in preventive cardiology and heart failure management.")
                .hospital(hospital1)
                .build());

        doctorRepository.save(Doctor.builder()
                .id("d2")
                .name("Dr. Rajesh Verma")
                .specialty("Dermatology")
                .fee(new BigDecimal("400"))
                .qualification("MBBS, MD (Dermatology)")
                .experience("10 years")
                .bio("Expert in treating skin conditions, cosmetic dermatology, and laser treatments.")
                .hospital(hospital1)
                .build());

        doctorRepository.save(Doctor.builder()
                .id("d3")
                .name("Dr. Priya Sharma")
                .specialty("Neurology")
                .fee(new BigDecimal("600"))
                .qualification("MBBS, DM (Neurology)")
                .experience("12 years")
                .bio("Specialist in treating neurological disorders including epilepsy, stroke, and migraines.")
                .hospital(hospital1)
                .build());

        // Create doctors for Hospital 2
        doctorRepository.save(Doctor.builder()
                .id("d4")
                .name("Dr. Meera Singh")
                .specialty("Pediatrics")
                .fee(new BigDecimal("350"))
                .qualification("MBBS, MD (Pediatrics)")
                .experience("8 years")
                .bio("Caring pediatrician dedicated to child health and development.")
                .hospital(hospital2)
                .build());

        doctorRepository.save(Doctor.builder()
                .id("d5")
                .name("Dr. Vikram Patel")
                .specialty("Orthopedics")
                .fee(new BigDecimal("550"))
                .qualification("MBBS, MS (Orthopedics)")
                .experience("14 years")
                .bio("Orthopedic surgeon specializing in joint replacement and sports injuries.")
                .hospital(hospital2)
                .build());

        // Create doctors for Hospital 3
        doctorRepository.save(Doctor.builder()
                .id("d6")
                .name("Dr. Anil Gupta")
                .specialty("Oncology")
                .fee(new BigDecimal("700"))
                .qualification("MBBS, MD, DM (Oncology)")
                .experience("18 years")
                .bio("Renowned oncologist with expertise in cancer treatment and research.")
                .hospital(hospital3)
                .build());

        doctorRepository.save(Doctor.builder()
                .id("d7")
                .name("Dr. Sunita Reddy")
                .specialty("Gastroenterology")
                .fee(new BigDecimal("500"))
                .qualification("MBBS, DM (Gastroenterology)")
                .experience("11 years")
                .bio("Expert in digestive disorders, liver diseases, and endoscopy procedures.")
                .hospital(hospital3)
                .build());

        log.info("Sample data initialized successfully!");
    }
}
