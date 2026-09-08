package com.hospital.booking.service.impl;

import com.hospital.booking.dto.BookingRequest;
import com.hospital.booking.entity.Booking;
import com.hospital.booking.repository.BookingRepository;
import com.hospital.booking.service.IBookingService;
import com.hospital.booking.service.SseEmitterService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class BookingService implements IBookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SseEmitterService sseEmitterService;

    @Override
    public Booking createBooking(BookingRequest request, String patientId) {
        log.info("Creating booking for patient: {} in hospital: {}", patientId, request.getHospitalId());

        Booking booking = Booking.builder()
                .patientId(patientId)
                .patientName(request.getPatientName())
                .hospitalId(request.getHospitalId())
                .hospitalName(request.getHospitalName())
                .department(request.getDepartment())
                .doctor(request.getDoctor())
                .slotDate(request.getSlotDate())
                .slotTime(request.getSlotTime())
                .status(Booking.BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Booking saved = bookingRepository.save(booking);
        log.info("Booking created with ID: {}", saved.getId());

        // Push to hospital dashboard instantly via SSE
        sseEmitterService.broadcastBooking(saved);

        return saved;
    }

    @Override
    public List<Booking> getBookingsByHospitalId(String hospitalId) {
        log.debug("Fetching bookings for hospital: {}", hospitalId);
        return bookingRepository.findByHospitalId(hospitalId);
    }

    @Override
    public List<Booking> getBookingsByPatientId(String patientId) {
        log.debug("Fetching bookings for patient: {}", patientId);
        return bookingRepository.findByPatientId(patientId);
    }

    @Override
    public Optional<Booking> getBookingById(String bookingId) {
        log.debug("Fetching booking with ID: {}", bookingId);
        return bookingRepository.findById(bookingId);
    }

    @Override
    public Booking updateBookingStatus(String bookingId, Booking.BookingStatus status) {
        log.info("Updating booking {} status to: {}", bookingId, status);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        booking.setUpdatedAt(LocalDateTime.now());
        Booking updated = bookingRepository.save(booking);

        // Broadcast update to hospital dashboard
        sseEmitterService.broadcastBookingUpdate(updated);

        return updated;
    }
}
