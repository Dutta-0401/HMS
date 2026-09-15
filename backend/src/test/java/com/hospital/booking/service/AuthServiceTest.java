package com.hospital.booking.service;

import com.hospital.booking.dto.AuthResponse;
import com.hospital.booking.dto.RegisterRequest;
import com.hospital.booking.dto.LoginRequest;
import com.hospital.booking.dto.UserDTO;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private BCryptPasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setName("Test User");
        request.setPhone("1234567890");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("hashed-password");
        User savedUser = User.builder()
                .id("user-id")
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash("hashed-password")
                .phone(request.getPhone())
                .role(User.UserRole.PATIENT)
                .hospitalId("hospital-id")
                .build();
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(jwtTokenProvider.generateToken(
                eq("user-id"),
                eq("test@example.com"),
                eq(User.UserRole.PATIENT),
                eq("hospital-id")
        )).thenReturn("fake-jwt-token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("user-id", response.getUser().getId());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).existsByEmail(request.getEmail());
        verify(passwordEncoder, times(1)).encode(request.getPassword());
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtTokenProvider, times(1)).generateToken(
                eq("user-id"),
                eq("test@example.com"),
                eq(User.UserRole.PATIENT),
                eq("hospital-id")
        );
    }

    @Test
    void testRegisterEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");
        request.setName("Test User");

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, times(1)).existsByEmail(request.getEmail());
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void testLoginSuccess() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        User user = User.builder()
                .id("user-id")
                .email("test@example.com")
                .passwordHash("hashed-password")
                .role(User.UserRole.PATIENT)
                .hospitalId("hospital-id")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(true);
        when(jwtTokenProvider.generateToken(
                eq("user-id"),
                eq("test@example.com"),
                eq(User.UserRole.PATIENT),
                eq("hospital-id")
        )).thenReturn("fake-jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("fake-jwt-token", response.getToken());
        assertNotNull(response.getUser());
        assertEquals("user-id", response.getUser().getId());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), user.getPasswordHash());
        verify(jwtTokenProvider, times(1)).generateToken(
                eq("user-id"),
                eq("test@example.com"),
                eq(User.UserRole.PATIENT),
                eq("hospital-id")
        );
    }

    @Test
    void testLoginInvalidEmail() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password");

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid email or password", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void testLoginInvalidPassword() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrong-password");

        User user = User.builder()
                .id("user-id")
                .email("test@example.com")
                .passwordHash("hashed-password")
                .role(User.UserRole.PATIENT)
                .hospitalId("hospital-id")
                .build();

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(request.getPassword(), user.getPasswordHash())).thenReturn(false);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            authService.login(request);
        });

        assertEquals("Invalid email or password", exception.getMessage());
        verify(userRepository, times(1)).findByEmail(request.getEmail());
        verify(passwordEncoder, times(1)).matches(request.getPassword(), user.getPasswordHash());
    }

    @Test
    void testGetCurrentUser() {
        String userId = "user-id";
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .name("Test User")
                .phone("1234567890")
                .role(User.UserRole.PATIENT)
                .hospitalId("hospital-id")
                .build();

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        UserDTO userDTO = authService.getCurrentUser(userId);

        assertNotNull(userDTO);
        assertEquals(userId, userDTO.getId());
        assertEquals("test@example.com", userDTO.getEmail());
        assertEquals("Test User", userDTO.getName());
        assertEquals("1234567890", userDTO.getPhone());
        assertEquals(User.UserRole.PATIENT.toString(), userDTO.getRole());
        verify(userRepository, times(1)).findById(userId);
    }
}