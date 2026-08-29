package com.saraprojects.product_api.service;

import com.saraprojects.product_api.dto.*;
import com.saraprojects.product_api.exception.AccountLockedException;
import com.saraprojects.product_api.exception.EmailAlreadyExistsException;
import com.saraprojects.product_api.exception.InvalidCredentialsException;
import com.saraprojects.product_api.exception.PasswordMismatchException;
import com.saraprojects.product_api.exception.InvalidRequestException;
import com.saraprojects.product_api.model.RefreshToken;
import com.saraprojects.product_api.model.User;
import com.saraprojects.product_api.repository.UserRepository;
import com.saraprojects.product_api.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final int MAX_ATTEMPTS = 3;
    private static final int LOCK_DURATION_MINUTES = 5;

    private static final Set<Integer> ALLOWED_AVATAR_IDS = Set.of(1, 2, 3, 4, 5, 6, 7, 8);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    public RegisterResponseDTO register(RegisterRequestDTO dto) {

        if (!dto.password().equals(dto.confirmPassword())) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        if (userRepository.existsByEmail(dto.email())) {
            throw new EmailAlreadyExistsException("Email already in use");
        }

        if (!ALLOWED_AVATAR_IDS.contains(dto.avatarId())) {
            throw new InvalidRequestException("Invalid avatar selected");
        }

        String employeeCode = generateUniqueEmployeeCode();

        User user = User.builder()
                .name(dto.name())
                .email(dto.email())
                .employeeCode(employeeCode)
                .password(passwordEncoder.encode(dto.password()))
                .avatarId(dto.avatarId())
                .failedAttempts(0)
                .build();

        userRepository.save(user);

        emailService.sendEmployeeCodeEmail(user.getEmail(), user.getName(), employeeCode);

        return new RegisterResponseDTO(
                employeeCode,
                user.getName(),
                user.getAvatarId(),
                "Account created successfully! Your employee code has also been sent to your email."
        );
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {

        User user = userRepository.findByEmployeeCode(dto.employeeCode())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid employee code or password"));

        LocalDateTime now = LocalDateTime.now();

        if (user.getLockedUntil() != null) {
            if (user.getLockedUntil().isAfter(now)) {
                throw new AccountLockedException(buildLockMessage(user.getLockedUntil(), now));
            }
            user.setFailedAttempts(0);
            user.setLockedUntil(null);
        }

        boolean passwordMatches = passwordEncoder.matches(dto.password(), user.getPassword());

        if (!passwordMatches) {
            int attempts = user.getFailedAttempts() + 1;
            user.setFailedAttempts(attempts);

            if (attempts >= MAX_ATTEMPTS) {
                LocalDateTime lockedUntil = now.plusMinutes(LOCK_DURATION_MINUTES);
                user.setLockedUntil(lockedUntil);
                userRepository.save(user);
                throw new AccountLockedException(buildLockMessage(lockedUntil, now));
            }

            userRepository.save(user);
            int remaining = MAX_ATTEMPTS - attempts;
            throw new InvalidCredentialsException(
                    "Invalid employee code or password. " + remaining + " attempt(s) remaining before lockout."
            );
        }

        user.setFailedAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponseDTO(
                accessToken,
                refreshToken.getToken(),
                "Bearer",
                user.getEmployeeCode(),
                user.getName(),
                user.getAvatarId()
        );
    }

    public AuthResponseDTO refresh(RefreshRequestDTO dto) {

        RefreshToken oldToken = refreshTokenService.validateAndGet(dto.refreshToken());
        User user = oldToken.getUser();

        refreshTokenService.revoke(oldToken);
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user);

        String newAccessToken = jwtService.generateAccessToken(user);

        return new AuthResponseDTO(
                newAccessToken,
                newRefreshToken.getToken(),
                "Bearer",
                user.getEmployeeCode(),
                user.getName(),
                user.getAvatarId()
        );
    }

    public void logout(RefreshRequestDTO dto) {
        RefreshToken token = refreshTokenService.validateAndGet(dto.refreshToken());
        refreshTokenService.revoke(token);
    }

    private String generateUniqueEmployeeCode() {
        String code;
        do {
            int number = 1000 + secureRandom.nextInt(9000);
            code = "EMP-" + number;
        } while (userRepository.existsByEmployeeCode(code));

        return code;
    }

    private String buildLockMessage(LocalDateTime lockedUntil, LocalDateTime now) {
        long totalSeconds = Duration.between(now, lockedUntil).getSeconds();
        long minutes = totalSeconds / 60;
        long seconds = totalSeconds % 60;

        if (minutes > 0) {
            return "Account locked. Try again in " + minutes + "m " + seconds + "s.";
        }
        return "Account locked. Try again in " + seconds + "s.";
    }
}