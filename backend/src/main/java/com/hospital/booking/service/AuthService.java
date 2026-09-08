package com.hospital.booking.service;

import com.hospital.booking.dto.*;
import com.hospital.booking.entity.User;
import com.hospital.booking.repository.UserRepository;
import com.hospital.booking.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Hash password with BCrypt
        String passwordHash = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordHash)
                .phone(request.getPhone())
                .role(request.getRole() != null ? request.getRole() : User.UserRole.PATIENT)
                .hospitalId(request.getHospitalId())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {}", savedUser.getId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole(),
                savedUser.getHospitalId()
        );

        UserDTO userDTO = UserDTO.builder()
                .id(savedUser.getId())
                .name(savedUser.getName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .role(savedUser.getRole().toString())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Verify password using BCrypt
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        log.info("Login successful for user: {}", user.getId());

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getHospitalId()
        );

        UserDTO userDTO = UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().toString())
                .build();

        return AuthResponse.builder()
                .token(token)
                .user(userDTO)
                .build();
    }

    public UserDTO getCurrentUser(String userId) {
        log.debug("Fetching user profile for ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().toString())
                .build();
    }
}
