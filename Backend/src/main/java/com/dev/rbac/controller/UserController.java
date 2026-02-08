package com.dev.rbac.controller;

import com.dev.rbac.model.User;
import com.dev.rbac.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("Fetching all users");
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        
        User createdUser = userService.createUser(user, request.getRoles());
        return ResponseEntity.ok(createdUser);
    }
    
    @PutMapping("/{id}/roles")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ResponseEntity<User> updateUserRoles(
            @PathVariable Long id,
            @RequestBody UpdateRolesRequest request) {
        User updatedUser = userService.updateUserRoles(id, request.getRoles());
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
    
    @Data
    public static class CreateUserRequest {
        private String username;
        private String email;
        private String password;
        private Set<String> roles;
    }
    
    @Data
    public static class UpdateRolesRequest {
        private Set<String> roles;
    }
}