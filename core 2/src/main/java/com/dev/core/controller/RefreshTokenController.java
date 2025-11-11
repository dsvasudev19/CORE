package com.dev.core.controller;


import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.dev.core.api.ControllerHelper;
import com.dev.core.model.RefreshTokenDTO;
import com.dev.core.model.UserDTO;
import com.dev.core.service.RefreshTokenService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/tokens")
@RequiredArgsConstructor
public class RefreshTokenController {

    private final RefreshTokenService refreshTokenService;
    private final ControllerHelper helper;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody UserDTO userDto,
                                    @RequestHeader(value = "User-Agent", required = false) String userAgent,
                                    @RequestHeader(value = "X-Forwarded-For", required = false) String ipAddress) {
        return helper.success("Token created", refreshTokenService.createToken(userDto, userAgent, ipAddress));
    }

    @GetMapping("/{token}")
    public ResponseEntity<?> getByToken(@PathVariable String token) {
        Optional<RefreshTokenDTO> result = refreshTokenService.getByToken(token);
        return helper.success("Token fetched", result.orElse(null));
    }

    @PostMapping("/revoke/{token}")
    public ResponseEntity<?> revoke(@PathVariable String token) {
        refreshTokenService.revokeToken(token);
        return helper.success("Token revoked successfully");
    }

    @PostMapping("/revoke/user/{userId}")
    public ResponseEntity<?> revokeUserTokens(@PathVariable Long userId) {
        refreshTokenService.revokeTokensForUser(userId);
        return helper.success("User tokens revoked successfully");
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam Long organizationId, Pageable pageable) {
        Page<RefreshTokenDTO> result = refreshTokenService.getTokens(organizationId, pageable);
        return helper.success("Tokens fetched", result);
    }
}
