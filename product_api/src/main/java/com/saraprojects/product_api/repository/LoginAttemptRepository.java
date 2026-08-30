package com.saraprojects.product_api.repository;

import com.saraprojects.product_api.model.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    Optional<LoginAttempt> findByEmployeeCode(String employeeCode);
}