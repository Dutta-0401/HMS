package com.hospital.booking.controller;

import com.hospital.booking.dto.BookingRequest;
import com.hospital.booking.entity.Booking;
import com.hospital.booking.service.IBookingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final IBookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String patientId = auth.getName(); // Returns the username (userId) from UserDetails
        
        log.info("Creating booking for patient: {}", patientId);
        Booking booking = bookingService.createBooking(request, patientId);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Booking>> getHospitalBookings(@PathVariable String hospitalId) {
        log.info("Fetching bookings for hospital: {}", hospitalId);
        List<Booking> bookings = bookingService.getBookingsByHospitalId(hospitalId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String patientId = (String) auth.getPrincipal();
        
        log.info("Fetching bookings for patient: {}", patientId);
        List<Booking> bookings = bookingService.getBookingsByPatientId(patientId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<Booking> getBooking(@PathVariable String bookingId) {
        log.info("Fetching booking: {}", bookingId);
        return bookingService.getBookingById(bookingId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{bookingId}/status")
    public ResponseEntity<Booking> updateBookingStatus(
            @PathVariable String bookingId,
            @RequestParam Booking.BookingStatus status) {
        log.info("Updating booking {} status to: {}", bookingId, status);
        Booking updated = bookingService.updateBookingStatus(bookingId, status);
        return ResponseEntity.ok(updated);
    }
}
