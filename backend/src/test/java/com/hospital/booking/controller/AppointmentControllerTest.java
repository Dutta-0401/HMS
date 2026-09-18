package com.hospital.booking.controller;

import com.hospital.booking.dto.AppointmentDTO;
import com.hospital.booking.service.AppointmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * The Profile page calls GET /api/appointments/my-appointments.
 * It must resolve the user from the JWT identity and return 200 with
 * that user's appointments (this endpoint was missing entirely, so the
 * page silently rendered an empty list).
 */
class AppointmentControllerTest {

    @Mock
    private AppointmentService appointmentService;

    @InjectMocks
    private AppointmentController appointmentController;

    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userDetails = new User("user-1", "password", Collections.emptyList());
    }

    @Test
    void testGetMyAppointmentsUsesJwtIdentity() {
        AppointmentDTO dto = new AppointmentDTO();
        when(appointmentService.getUserAppointments("user-1")).thenReturn(List.of(dto));

        ResponseEntity<List<AppointmentDTO>> response =
                appointmentController.getMyAppointments(userDetails);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(1, response.getBody().size());
        verify(appointmentService, times(1)).getUserAppointments("user-1");
        // Must never accept a client-supplied user id on this route
        verify(appointmentService, never()).getUserAppointments(argThat(id -> !"user-1".equals(id)));
    }

    @Test
    void testGetMyAppointmentsEmptyWhenNoneBooked() {
        when(appointmentService.getUserAppointments("user-1")).thenReturn(List.of());

        ResponseEntity<List<AppointmentDTO>> response =
                appointmentController.getMyAppointments(userDetails);

        assertEquals(200, response.getStatusCode().value());
        assertTrue(response.getBody().isEmpty());
    }
}
