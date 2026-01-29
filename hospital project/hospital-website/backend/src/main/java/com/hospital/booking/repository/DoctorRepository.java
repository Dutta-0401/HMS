package com.hospital.booking.repository;

import com.hospital.booking.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    
    List<Doctor> findByHospitalId(String hospitalId);
    
    List<Doctor> findBySpecialty(String specialty);
}
