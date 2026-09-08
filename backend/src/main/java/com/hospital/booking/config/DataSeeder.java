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
import java.util.List;

/**
 * Seeds sample hospitals and doctors on first startup when the collections are
 * empty. This makes a fresh (e.g. local) database immediately usable. It is a
 * no-op once data exists, so it is safe to leave enabled in any environment.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final HospitalRepository hospitalRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public void run(String... args) {
        if (hospitalRepository.count() > 0 || doctorRepository.count() > 0) {
            log.info("Database already contains data - skipping seed");
            return;
        }

        log.info("Empty database detected - seeding sample hospitals and doctors");

        Hospital cityHealth = hospitalRepository.save(Hospital.builder()
                .name("CityHealth Multispecialty Hospital")
                .city("Mumbai")
                .address("12 Marine Drive, Mumbai 400020")
                .phone("+91 22 4000 1000")
                .email("contact@cityhealth.example")
                .imageUrl("https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800")
                .departments(List.of("Cardiology", "Neurology", "Orthopedics", "General Medicine"))
                .build());

        Hospital sunrise = hospitalRepository.save(Hospital.builder()
                .name("Sunrise Care Hospital")
                .city("Pune")
                .address("88 FC Road, Pune 411004")
                .phone("+91 20 6600 2000")
                .email("hello@sunrisecare.example")
                .imageUrl("https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800")
                .departments(List.of("Pediatrics", "Dermatology", "ENT", "General Medicine"))
                .build());

        doctorRepository.saveAll(List.of(
                Doctor.builder()
                        .name("Dr. Anita Sharma")
                        .specialty("Cardiology")
                        .fee(new BigDecimal("800"))
                        .qualification("MBBS, MD (Cardiology)")
                        .experience("15 years")
                        .imageUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400")
                        .bio("Senior cardiologist specializing in preventive heart care.")
                        .hospitalId(cityHealth.getId())
                        .build(),
                Doctor.builder()
                        .name("Dr. Rajesh Mehta")
                        .specialty("Neurology")
                        .fee(new BigDecimal("1000"))
                        .qualification("MBBS, DM (Neurology)")
                        .experience("12 years")
                        .imageUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400")
                        .bio("Neurologist with a focus on stroke and epilepsy management.")
                        .hospitalId(cityHealth.getId())
                        .build(),
                Doctor.builder()
                        .name("Dr. Priya Nair")
                        .specialty("Pediatrics")
                        .fee(new BigDecimal("600"))
                        .qualification("MBBS, MD (Pediatrics)")
                        .experience("10 years")
                        .imageUrl("https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400")
                        .bio("Pediatrician dedicated to child wellness and vaccination.")
                        .hospitalId(sunrise.getId())
                        .build(),
                Doctor.builder()
                        .name("Dr. Vikram Singh")
                        .specialty("Dermatology")
                        .fee(new BigDecimal("700"))
                        .qualification("MBBS, MD (Dermatology)")
                        .experience("8 years")
                        .imageUrl("https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400")
                        .bio("Dermatologist treating skin, hair and cosmetic concerns.")
                        .hospitalId(sunrise.getId())
                        .build()
        ));

        log.info("Seeded {} hospitals and {} doctors",
                hospitalRepository.count(), doctorRepository.count());
    }
}
