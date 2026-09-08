package com.hospital.booking.repository;

import com.hospital.booking.entity.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {
    
    List<Booking> findByHospitalId(String hospitalId);
    
    List<Booking> findByPatientId(String patientId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByHospitalIdAndStatus(String hospitalId, Booking.BookingStatus status);
}
