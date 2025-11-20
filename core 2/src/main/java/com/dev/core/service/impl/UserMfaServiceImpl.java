package com.dev.core.service.impl;

import com.dev.core.constants.MfaType;
import com.dev.core.domain.UserMfaFactor;
import com.dev.core.model.UserMfaFactorDTO;
import com.dev.core.repository.UserMfaFactorRepository;
import com.dev.core.service.NotificationService;
import com.dev.core.service.OtpStore;
import com.dev.core.service.UserMfaService;
import com.dev.core.service.UserService;
import com.dev.core.service.validation.UserMfaFactorValidator;
import com.dev.core.util.TotpUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.zxing.*;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;

import java.io.ByteArrayOutputStream;
import java.security.SecureRandom;
import java.util.*;
import java.util.Base64;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class UserMfaServiceImpl implements UserMfaService {

    private final UserMfaFactorRepository mfaFactorRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final OtpStore otpStore;
    private final UserMfaFactorValidator validator;

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();
    private static final int EMAIL_OTP_LENGTH = 6;
    private static final long EMAIL_OTP_TTL_SECONDS = 300; // 5 minutes
    private static final int BACKUP_CODES_COUNT = 10;
    private static final int BACKUP_CODE_LENGTH = 8;

    private final BCryptPasswordEncoder backupCodeEncoder = new BCryptPasswordEncoder(10);

    // =========================================================================
    // Enrollment
    // =========================================================================

    @Override
    public UserMfaFactorDTO initiateEnrollment(Long userId, MfaType type) {

        validator.validateBeforeCreate(userId, buildDTO(type));

        UserMfaFactor factor = mfaFactorRepository.findByUserIdAndType(userId, type)
                .orElseGet(UserMfaFactor::new);

        factor.setType(type);
        factor.setVerified(false);
        factor.setEnabled(false);

        if (type == MfaType.AUTHENTICATOR) {
            String secret = TotpUtil.generateSecret();
            factor.setTotpSecret(secret);

            String qrBase64 = generateQrCodeBase64(
                    userId,
                    secret,
                    "YourApp" // Customize issuer as needed
            );

            Map<String, Object> meta = new HashMap<>();
            meta.put("qrCodeBase64", qrBase64);
            factor.setMetadata(meta);
        }
        else if (type == MfaType.EMAIL) {
            String email = userService.getUserById(userId).getEmail();
            factor.setEmailForOtp(email); // ← Critical fix

            String otp = generateNumericOtp(EMAIL_OTP_LENGTH);
            String key = otpKey(userId, "enroll:email");

            otpStore.saveOtp(key, otp, EMAIL_OTP_TTL_SECONDS);

            notificationService.sendEmail(
                    email,
                    "Verify Your Email for MFA",
                    "Your verification code is: " + otp + "\nValid for 5 minutes."
            );
        }
        else {
            throw new UnsupportedOperationException("Unsupported MFA type for enrollment: " + type);
        }

        mfaFactorRepository.save(factor);
        return toDtoSafe(factor);
    }

    @Override
    public boolean verifyEnrollment(Long userId, MfaType type, String code) {

        validator.validateBeforeUpdate(userId, type, buildDTO(type));

        UserMfaFactor factor = mfaFactorRepository.findByUserIdAndType(userId, type)
                .orElseThrow(() -> new IllegalStateException("No enrollment active for type: " + type));

        boolean valid = false;

        if (type == MfaType.AUTHENTICATOR) {
            valid = TotpUtil.verifyTotp(factor.getTotpSecret(), code);
        }
        else if (type == MfaType.EMAIL) {
            String key = otpKey(userId, "enroll:email");
            String stored = otpStore.getOtp(key);
            valid = code.equals(stored);

            if (valid) {
                otpStore.removeOtp(key);
            }
        }

        if (valid) {
            factor.setVerified(true);
            mfaFactorRepository.save(factor);
        }

        return valid;
    }

    @Override
    public UserMfaFactorDTO enableFactor(Long userId, MfaType type) {
        UserMfaFactor factor = getVerifiedFactor(userId, type);
        factor.setEnabled(true);
        mfaFactorRepository.save(factor);
        return toDtoSafe(factor);
    }

    @Override
    public void disableFactor(Long userId, MfaType type) {
        mfaFactorRepository.findByUserIdAndType(userId, type)
                .ifPresent(f -> {
                    f.setEnabled(false);
                    mfaFactorRepository.save(f);
                });
    }

    // =========================================================================
    // Login Challenge
    // =========================================================================

    @Override
    public MfaType determineChallengeFactor(Long userId) {
//        validator.validateUserExists(userId);

        return mfaFactorRepository.findByUserId(userId).stream()
                .filter(f -> f.isEnabled() && f.isVerified())
                .sorted(Comparator.comparingInt(f -> priority(f.getType())))
                .map(UserMfaFactor::getType)
                .findFirst()
                .orElse(null);
    }

    @Override
    public void sendChallenge(Long userId, MfaType type) {

        validator.validateBeforeUpdate(userId, type, buildDTO(type));

        if (type == MfaType.AUTHENTICATOR) {
            return; // TOTP is client-generated
        }

        if (type == MfaType.EMAIL) {
            UserMfaFactor factor = mfaFactorRepository.findByUserIdAndType(userId, MfaType.EMAIL)
                    .orElseThrow(() -> new IllegalStateException("Email MFA not enrolled"));

            String otp = generateNumericOtp(EMAIL_OTP_LENGTH);
            String key = otpKey(userId, "login:email");

            otpStore.saveOtp(key, otp, EMAIL_OTP_TTL_SECONDS);

            notificationService.sendEmail(
                    factor.getEmailForOtp(),
                    "Your MFA Login Code",
                    "Your login verification code is: " + otp + "\nValid for 5 minutes."
            );
            return;
        }

        throw new UnsupportedOperationException("Unsupported challenge type: " + type);
    }

    @Override
    public boolean verifyChallenge(Long userId, MfaType type, String code) {

        validator.validateBeforeUpdate(userId, type, buildDTO(type));

        UserMfaFactor factor = mfaFactorRepository.findByUserIdAndType(userId, type)
                .orElseThrow(() -> new IllegalStateException("No MFA factor found for type: " + type));

        boolean valid = false;

        if (type == MfaType.AUTHENTICATOR) {
            valid = TotpUtil.verifyTotp(factor.getTotpSecret(), code);
        }
        else if (type == MfaType.EMAIL) {
            String key = otpKey(userId, "login:email");
            String stored = otpStore.getOtp(key);
            valid = code.equals(stored);
            if (valid) {
                otpStore.removeOtp(key);
            }
        }

        return valid;
    }

    // =========================================================================
    // Backup Codes
    // =========================================================================

    @Override
    public List<String> generateBackupCodes(Long userId) {

//        validator.validateUserExists(userId);

        List<String> plainCodes = new ArrayList<>();
        List<String> hashedCodes = new ArrayList<>();

        for (int i = 0; i < BACKUP_CODES_COUNT; i++) {
            String raw = generateAlphanumeric(BACKUP_CODE_LENGTH);
            plainCodes.add(raw);
            hashedCodes.add(backupCodeEncoder.encode(raw));
        }

        String csvHashed = String.join(",", hashedCodes);

        UserMfaFactor factor = mfaFactorRepository.findByUserIdAndType(userId, MfaType.BACKUP)
                .orElseGet(UserMfaFactor::new);

        factor.setUser(userId);
        factor.setType(MfaType.BACKUP);
        factor.setBackupCodesJson(csvHashed);  // ← Fixed: use correct column
        factor.setVerified(true);
        factor.setEnabled(true);

        mfaFactorRepository.save(factor);

        return plainCodes;
    }

    @Override
    public boolean verifyBackupCode(Long userId, String code) {

//        validator.validateUserExists(userId);

        return mfaFactorRepository.findByUserIdAndType(userId, MfaType.BACKUP)
                .map(factor -> {
                    if (factor.getBackupCodesJson() == null || factor.getBackupCodesJson().isEmpty()) {
                        return false;
                    }

                    List<String> hashedCodes = Arrays.asList(factor.getBackupCodesJson().split(","));

                    Optional<String> matched = hashedCodes.stream()
                            .filter(h -> backupCodeEncoder.matches(code, h))
                            .findFirst();

                    if (matched.isEmpty()) {
                        return false;
                    }

                    // Remove used code
                    List<String> remaining = hashedCodes.stream()
                            .filter(h -> !h.equals(matched.get()))
                            .collect(Collectors.toList());

                    if (remaining.isEmpty()) {
                        mfaFactorRepository.delete(factor);
                    } else {
                        factor.setBackupCodesJson(String.join(",", remaining));
                        mfaFactorRepository.save(factor);
                    }

                    return true;
                })
                .orElse(false);
    }

    // =========================================================================
    // Retrieval
    // =========================================================================

    @Override
    public List<UserMfaFactorDTO> getUserMfaFactors(Long userId) {
//        validator.validateUserExists(userId);

        return mfaFactorRepository.findByUserId(userId).stream()
                .map(this::toDtoSafe)
                .collect(Collectors.toList());
    }

    @Override
    public UserMfaFactorDTO getFactor(Long userId, MfaType type) {
        validator.validateBeforeUpdate(userId, type, buildDTO(type));

        return mfaFactorRepository.findByUserIdAndType(userId, type)
                .map(this::toDtoSafe)
                .orElse(null);
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    private UserMfaFactor getVerifiedFactor(Long userId, MfaType type) {
        return mfaFactorRepository.findByUserIdAndType(userId, type)
                .filter(UserMfaFactor::isVerified)
                .orElseThrow(() -> new IllegalStateException("MFA factor not verified for type: " + type));
    }

    private String otpKey(Long userId, String scope) {
        return scope + ":" + userId;
    }

    private String generateNumericOtp(int length) {
        int min = (int) Math.pow(10, length - 1);
        int max = min * 10;
        return String.valueOf(min + SECURE_RANDOM.nextInt(max - min));
    }

    private String generateAlphanumeric(int length) {
        final String chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(SECURE_RANDOM.nextInt(chars.length())));
        }
        return sb.toString();
    }

    private int priority(MfaType t) {
        return switch (t) {
            case AUTHENTICATOR -> 1;
            case EMAIL -> 2;
            case BACKUP -> 100;
            default -> 50;
        };
    }

    private String generateQrCodeBase64(Long userId, String secret, String issuer) {
        String email = userService.getUserById(userId).getEmail();
        String otpauth = String.format(
                "otpauth://totp/%s:%s?secret=%s&issuer=%s",
                issuer, email, secret, issuer
        );

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            BitMatrix matrix = new MultiFormatWriter()
                    .encode(otpauth, BarcodeFormat.QR_CODE, 300, 300);
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return Base64.getEncoder().encodeToString(out.toByteArray());
        } catch (Exception ex) {
            throw new RuntimeException("Failed to generate QR code", ex);
        }
    }

    private UserMfaFactorDTO toDtoSafe(UserMfaFactor entity) {
        UserMfaFactorDTO dto = new UserMfaFactorDTO();
        dto.setType(entity.getType());
        dto.setEnabled(entity.isEnabled());
        dto.setVerified(entity.isVerified());

        if (entity.getMetadata() != null) {
            dto.setMetadata(new HashMap<>(entity.getMetadata()));
        }

        return dto;
    }

    private UserMfaFactorDTO buildDTO(MfaType type) {
        UserMfaFactorDTO dto = new UserMfaFactorDTO();
        dto.setType(type);
        return dto;
    }
}