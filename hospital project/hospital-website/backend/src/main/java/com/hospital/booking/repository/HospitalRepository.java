package com.hospital.booking.repository;

import com.hospital.booking.entity.Hospital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HospitalRepository extends MongoRepository<Hospital, String> {
    
    List<Hospital> findByCity(String city);
    
    List<Hospital> findByDepartmentsContaining(String department);
}

