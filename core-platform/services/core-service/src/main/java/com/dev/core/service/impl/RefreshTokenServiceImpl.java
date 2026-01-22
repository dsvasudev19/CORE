//package com.dev.core.service.impl;
//
//import java.time.LocalDateTime;
//import java.util.Optional;
//import java.util.UUID;
//
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.dev.core.domain.RefreshToken;
//import com.dev.core.domain.User;
//import com.dev.core.exception.BaseException;
//import com.dev.core.mapper.RefreshTokenMapper;
//import com.dev.core.model.RefreshTokenDTO;
//import com.dev.core.repository.RefreshTokenRepository;
//import com.dev.core.repository.UserRepository;
//import com.dev.core.service.RefreshTokenService;
//import com.dev.core.service.validation.RefreshTokenValidator;
//
//import lombok.RequiredArgsConstructor;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class RefreshTokenServiceImpl implements RefreshTokenService {
//
//    private final RefreshTokenRepository refreshTokenRepository;
//    private final UserRepository userRepository;
//    private final RefreshTokenValidator refreshTokenValidator;
//
//    @Override
//    public RefreshTokenDTO createToken(com.dev.core.model.UserDTO userDto, String userAgent, String ipAddress) {
//        if (userDto == null || userDto.getId() == null) throw new BaseException("error.token.user.required");
//        User user = userRepository.findById(userDto.getId())
//                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userDto.getId()}));
//
//        RefreshToken token = new RefreshToken();
//        token.setUser(user);
//        String raw = UUID.randomUUID().toString();
//        // store hashed/encrypted token if required — currently storing raw for simplicity (not recommended for production)
//        token.setToken(raw);
//        token.setExpiresAt(LocalDateTime.now().plusDays(30)); // default expiry 30 days
//        token.setIpAddress(ipAddress);
//        token.setUserAgent(userAgent);
//        token.setOrganizationId(user.getOrganizationId());
//        RefreshToken saved = refreshTokenRepository.save(token);
//        return RefreshTokenMapper.toDTO(saved);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Optional<RefreshTokenDTO> getByToken(String token) {
//        return refreshTokenRepository.findByToken(token).map(RefreshTokenMapper::toDTO);
//    }
//
//    @Override
//    public void revokeToken(String token) {
//        refreshTokenValidator.validateTokenExists(token);
//        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
//            rt.setRevoked(true);
//            refreshTokenRepository.save(rt);
//        });
//    }
//
//    @Override
//    public void revokeTokensForUser(Long userId) {
//        if (userId == null) throw new BaseException("error.user.id.required");
//        User user = userRepository.findById(userId).orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userId}));
//        refreshTokenRepository.findByUser(user).ifPresent(rt -> {
//            refreshTokenRepository.deleteByUser(user); // deletes all tokens for user (method in repository)
//        });
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<RefreshTokenDTO> getTokens(Long organizationId, Pageable pageable) {
//        Page<RefreshToken> page = refreshTokenRepository.findAllByOrganizationId(organizationId, pageable);
//        return page.map(RefreshTokenMapper::toDTO);
//    }
//}


package com.dev.core.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dev.core.domain.RefreshToken;
import com.dev.core.domain.User;
import com.dev.core.exception.BaseException;
import com.dev.core.mapper.RefreshTokenMapper;
import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.repository.RefreshTokenRepository;
import com.dev.core.repository.UserRepository;
import com.dev.core.service.AuthorizationService; // ✅ Correct import for RBAC
import com.dev.core.service.RefreshTokenService;
import com.dev.core.service.validation.RefreshTokenValidator;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final RefreshTokenValidator refreshTokenValidator;
    private final AuthorizationService authorizationService; // ✅ Injected for policy-based RBAC

    /**
     * Helper for dynamic authorization.
     */
    private void authorize(String action) {
        String resource = this.getClass().getSimpleName()
                .replace("ServiceImpl", "")
                .replace("Service", "")
                .toUpperCase();
        authorizationService.authorize(resource, action);
    }

    @Override
    public RefreshTokenDTO createToken(com.dev.core.model.UserDTO userDto, String userAgent, String ipAddress) {
//        authorize("CREATE"); // ✅ Ensure caller can CREATE REFRESHTOKEN
        if (userDto == null || userDto.getId() == null)
            throw new BaseException("error.token.user.required");

        User user = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userDto.getId()}));

        RefreshToken token = new RefreshToken();
        token.setUser(user);

        // Generate token (can be hashed later for production)
        String raw = UUID.randomUUID().toString();
        token.setToken(raw);
        token.setExpiresAt(LocalDateTime.now().plusDays(30)); // 30 days validity
        token.setIpAddress(ipAddress);
        token.setUserAgent(userAgent);
        token.setOrganizationId(user.getOrganizationId());

        RefreshToken saved = refreshTokenRepository.save(token);
        return RefreshTokenMapper.toDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<RefreshTokenDTO> getByToken(String token) {
//        authorize("READ"); // ✅ Ensure caller can READ REFRESHTOKEN
        return refreshTokenRepository.findByToken(token).map(RefreshTokenMapper::toDTO);
    }

    @Override
    public void revokeToken(String token) {
//        authorize("UPDATE"); // ✅ Ensure caller can UPDATE REFRESHTOKEN (revoking = update)
        refreshTokenValidator.validateTokenExists(token);
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    @Override
    public void revokeTokensForUser(Long userId) {
//        authorize("DELETE"); // ✅ Ensure caller can DELETE REFRESHTOKEN
        if (userId == null)
            throw new BaseException("error.user.id.required");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BaseException("error.user.not.found", new Object[]{userId}));

        refreshTokenRepository.findByUser(user).ifPresent(rt -> {
            refreshTokenRepository.deleteByUser(user); // deletes all tokens for user
        });
    }
    

    @Override
    @Transactional(readOnly = true)
    public Page<RefreshTokenDTO> getTokens(Long organizationId, Pageable pageable) {
//        authorize("READ"); // ✅ Ensure caller can READ REFRESHTOKEN
        Page<RefreshToken> page = refreshTokenRepository.findAllByOrganizationId(organizationId, pageable);
        return page.map(RefreshTokenMapper::toDTO);
    }
}
