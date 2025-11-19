package com.dev.core.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.dev.core.constants.ProfileType;
import com.dev.core.model.UserDTO;
import com.dev.core.model.UserPermissionIdsDTO;

public interface UserService {

    UserDTO createUser(UserDTO dto);

    UserDTO updateUser(Long id, UserDTO dto);

    void deleteUser(Long id);

    UserDTO getUserById(Long id);

    Optional<UserDTO> getUserByEmail(String email);

    List<UserDTO> getAllUsers(Long organizationId);

    Page<UserDTO> searchUsers(Long organizationId, String keyword, Pageable pageable);
    
    UserDTO assignPermissionsToUser(Long userId, UserPermissionIdsDTO dto);

    UserDTO removePermissionsFromUser(Long userId, UserPermissionIdsDTO dto);
    
    UserDTO createUserForEmployee(Long employeeId, UserDTO dto);

    UserDTO createUserForClientRepresentative(Long representativeId, UserDTO dto);

    UserDTO createUserAndLink(Long profileId, UserDTO dto, ProfileType type);

}
