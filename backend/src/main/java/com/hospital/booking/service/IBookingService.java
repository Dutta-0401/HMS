package com.hospital.booking.service;

import com.hospital.booking.dto.BookingRequest;
import com.hospital.booking.entity.Booking;

import java.util.List;
import java.util.Optional;

public interface IBookingService {
    Booking createBooking(BookingRequest request, String patientId);
    List<Booking> getBookingsByHospitalId(String hospitalId);
    List<Booking> getBookingsByPatientId(String patientId);
    Optional<Booking> getBookingById(String bookingId);
    Booking updateBookingStatus(String bookingId, Booking.BookingStatus status);
}
