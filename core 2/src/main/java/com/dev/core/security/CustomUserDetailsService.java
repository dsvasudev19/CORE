package com.dev.core.security;


import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dev.core.domain.Role;
import com.dev.core.domain.User;
import com.dev.core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Loads user details from the database and adapts to Spring Security's UserDetails.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads user by username (or email) for authentication.
     */
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        // You can choose whether username or email is used for login
//        User user = userRepository.findByUsernameOrEmail(username, username)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
//
//        // Convert roles → authorities
//        Set<GrantedAuthority> authorities = user.getRoles().stream()
//                .map(Role::getName)
//                .map(SimpleGrantedAuthority::new)
//                .collect(Collectors.toSet());
//
//        // Build CustomUserDetails for SecurityContext
//        return new CustomUserDetails(
//                user.getId(),
//                user.getOrganizationId() != null ? user.getOrganizationId() : null,
//                user.getUsername(),
//                user.getPassword(),
//                authorities
//        );
//    }
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmailWithRoles(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(Role::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        return new CustomUserDetails(
                user.getId(),
                user.getOrganizationId(),
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }

}
