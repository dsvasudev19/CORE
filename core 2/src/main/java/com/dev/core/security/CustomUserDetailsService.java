package com.dev.core.security;


import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.dev.core.domain.Employee;
import com.dev.core.domain.Role;
import com.dev.core.domain.User;
import com.dev.core.model.MinimalEmployeeDTO;
import com.dev.core.repository.EmployeeRepository;
import com.dev.core.repository.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Loads user details from the database and adapts to Spring Security's UserDetails.
 */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;

   
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsernameOrEmailWithRoles(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        
        Employee emp = employeeRepository.findByUserId(user.getId());
        MinimalEmployeeDTO empDto = null;
        if (emp != null) {
            empDto = MinimalEmployeeDTO.builder()
                    .id(emp.getId())
                    .employeeCode(emp.getEmployeeCode())
                    .firstName(emp.getFirstName())
                    .lastName(emp.getLastName())
                    .email(emp.getEmail())
                    .phone(emp.getPhone())
                    .build();
        }

        Set<GrantedAuthority> authorities = user.getRoles().stream()
                .map(Role::getName)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        return new CustomUserDetails(
                user.getId(),
                user.getOrganizationId(),
                user.getUsername(),
                user.getPassword(),
                empDto,
                authorities
        );
    }

}
