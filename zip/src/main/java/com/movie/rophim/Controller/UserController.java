package com.movie.rophim.Controller;

import com.movie.rophim.DTO.ChangePasswordDTO;
import com.movie.rophim.DTO.UpdateProfileDTO;
import com.movie.rophim.DTO.UserDTO;
import com.movie.rophim.Service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDTO> getAllUsers() { return userService.getAllUsers(); }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UserDTO getUserById(@PathVariable Long id) { return userService.getUserById(id); }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public String deleteUser(@PathVariable Long id) { userService.deleteUser(id); return "User deleted successfully"; }
    @GetMapping("/me")
    public UserDTO getMyProfile() {
        return userService.getMyProfile();
    }

    // Cập nhật profile
    @PutMapping("/me")
    public UserDTO updateMyProfile(@Valid @RequestBody UpdateProfileDTO request) {
        return userService.updateMyProfile(request);
    }
    @PutMapping("/me/password")
    public String changePassword(@Valid @RequestBody ChangePasswordDTO request) {
        userService.changePassword(request);
        return "Password changed successfully";
    }
}