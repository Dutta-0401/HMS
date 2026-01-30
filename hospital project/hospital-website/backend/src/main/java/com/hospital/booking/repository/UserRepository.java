package com.hospital.booking.repository;

import com.hospital.booking.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    
    Optional<User> findByPhone(String phone);
    
    boolean existsByPhone(String phone);
}
