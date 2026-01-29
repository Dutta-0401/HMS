package com.hospital.booking.service;

import com.hospital.booking.dto.*;
import com.hospital.booking.entity.Appointment;
import com.hospital.booking.entity.Doctor;
import com.hospital.booking.entity.User;
import com.hospital.booking.exception.ResourceNotFoundException;
import com.hospital.booking.exception.SlotNotAvailableException;
import com.hospital.booking.repository.AppointmentRepository;
import com.hospital.booking.repository.DoctorRepository;
import com.hospital.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    @Transactional
    public AppointmentResponse createAppointment(CreateAppointmentRequest request, String userId) {
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Find doctor
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Check if slot is already booked
        if (appointmentRepository.existsBySlotId(request.getSlotId())) {
            throw new SlotNotAvailableException("This slot is no longer available");
        }

        // Parse slot ID to get date and time
        String[] slotParts = request.getSlotId().split("-");
        String slotDate = slotParts.length >= 4 ? slotParts[1] + "-" + slotParts[2] + "-" + slotParts[3] : "";
        int slotIndex = slotParts.length >= 5 ? Integer.parseInt(slotParts[4]) : 0;
        String[] times = {"09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"};
        String slotTime = slotIndex < times.length ? times[slotIndex] : "09:00";

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

        // Create appointment
        Appointment appointment = Appointment.builder()
                .user(user)
                .doctor(doctor)
                .slotId(request.getSlotId())
                .slotDate(slotDate)
                .slotTime(slotTime)
                .paymentMethod(paymentMethod)
                .status(status)
                .amount(doctor.getFee())
                .razorpayOrderId(razorpayOrderId)
                .build();

        appointment = appointmentRepository.save(appointment);

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
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .doctorId(appointment.getDoctor().getId())
                .doctorName(appointment.getDoctor().getName())
                .doctorSpecialty(appointment.getDoctor().getSpecialty())
                .hospitalName(appointment.getDoctor().getHospital().getName())
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
