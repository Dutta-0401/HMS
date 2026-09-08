package com.hospital.booking.repository;

import com.hospital.booking.entity.Appointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    
    List<Appointment> findByUserId(String userId);
    
    List<Appointment> findByDoctorId(String doctorId);
    
    List<Appointment> findByDoctorIdAndSlotDate(String doctorId, String slotDate);
    
    boolean existsBySlotId(String slotId);
}
