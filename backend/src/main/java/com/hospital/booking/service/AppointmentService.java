package com.hospital.booking.service;

import com.hospital.booking.dto.*;
import com.hospital.booking.entity.Appointment;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.Hospital;
import com.hospital.booking.entity.User;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.exception.SlotNotAvailableException;
import com.hospital.booking.repository.AppointmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.HospitalRepository;
import com.hospital.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final HospitalRepository hospitalRepository;

    public AppointmentResponse createAppointment(CreateAppointmentRequest request, String userId) {
        // Verify user exists
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid request"));

        // Find doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid request"));

        // Parse and validate slot ID (already validated by @Pattern but double-check)
        String[] slotParts = request.getSlotId().split("-");
        if (slotParts.length != 5) {
            throw new IllegalArgumentException("Invalid slot format");
        }
        
        String slotDate = slotParts[1] + "-" + slotParts[2] + "-" + slotParts[3];
        int slotIndex;
        try {
            slotIndex = Integer.parseInt(slotParts[4]);
            if (slotIndex < 0 || slotIndex > 6) {
                throw new IllegalArgumentException("Slot index out of range");
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid slot index");
        }
        
        String[] times = {"09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"};
        String slotTime = times[slotIndex];

        // Determine payment method and status
        Appointment.PaymentMethod paymentMethod = "online".equalsIgnoreCase(request.getPaymentMethod())
                ? Appointment.PaymentMethod.ONLINE
                : Appointment.PaymentMethod.PAY_AT_HOSPITAL;

        Appointment.AppointmentStatus status = paymentMethod == Appointment.PaymentMethod.ONLINE
                ? Appointment.AppointmentStatus.PAYMENT_PENDING
                : Appointment.AppointmentStatus.CONFIRMED;

        // Generate Razorpay order ID for online payments
        String razorpayOrderId = paymentMethod == Appointment.PaymentMethod.ONLINE
                ? "order_" + UUID.randomUUID().toString().substring(0, 14)
                : null;

        // Create appointment with string IDs for MongoDB
        Appointment appointment = Appointment.builder()
                .userId(userId)
                .doctorId(request.getDoctorId())
                .slotId(request.getSlotId())
                .slotDate(slotDate)
                .slotTime(slotTime)
                .paymentMethod(paymentMethod)
                .status(status)
                .amount(doctor.getFee())
                .razorpayOrderId(razorpayOrderId)
                .build();

        // Save with unique constraint handling
        try {
            appointment = appointmentRepository.save(appointment);
        } catch (org.springframework.dao.DuplicateKeyException e) {
            throw new SlotNotAvailableException("This slot is no longer available");
        }

        return AppointmentResponse.builder()
                .appointmentId(appointment.getId())
                .status(appointment.getStatus().name().toLowerCase())
                .amount(appointment.getAmount())
                .razorpayOrderId(appointment.getRazorpayOrderId())
                .build();
    }

    public List<AppointmentDTO> getUserAppointments(String userId) {
        return appointmentRepository.findByUserId(userId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private AppointmentDTO toDTO(Appointment appointment) {
        // Fetch doctor details using doctorId
        Doctor doctor = doctorRepository.findById(appointment.getDoctorId())
                .orElse(null);

        String doctorName = doctor != null ? doctor.getName() : "Unknown Doctor";
        String doctorSpecialty = doctor != null ? doctor.getSpecialty() : "Unknown";
        String hospitalName = "Unknown Hospital";

        if (doctor != null) {
            hospitalName = hospitalRepository.findById(doctor.getHospitalId())
                    .map(Hospital::getName)
                    .orElse("Unknown Hospital");
        }

        return AppointmentDTO.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctorId())
                .doctorName(doctorName)
                .doctorSpecialty(doctorSpecialty)
                .hospitalName(hospitalName)
                .slotId(appointment.getSlotId())
                .slotDate(appointment.getSlotDate())
                .slotTime(appointment.getSlotTime())
                .paymentMethod(appointment.getPaymentMethod().name().toLowerCase())
                .status(appointment.getStatus().name().toLowerCase())
                .amount(appointment.getAmount())
                .createdAt(appointment.getCreatedAt())
                .build();
    }
}
