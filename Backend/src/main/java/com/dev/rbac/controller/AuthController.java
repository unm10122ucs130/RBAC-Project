package com.dev.rbac.controller;

import com.dev.rbac.model.User;
import com.dev.rbac.security.JwtService;
import com.dev.rbac.service.UserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserService userService;

    //Login verification

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

    /* FETCH ALL USERS  */
        User user = userService.findByUsername(request.getUsername());

        String role = user.getRoles()
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Role not found"))
                .getName();

        List<String> permissions = userService.getPermissionsByUsername(user.getUsername());

    // Generate JWT token
        String token = jwtService.generateToken(
                user.getUsername(),
                role,
                permissions
        );
        
        System.out.println("The Token is : "+token);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("username", user.getUsername());
        response.put("role", role);
        response.put("permissions", permissions);

        return ResponseEntity.ok(response);
    }

    // Registration for creating new users

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User createdUser = userService.createUser(user, request.getRoles());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        response.put("userId", createdUser.getId());

        return ResponseEntity.ok(response);
    }

    /* DTO -- Data Transfer Object, it is used to transfer only needed data from backend to frontend */

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private Set<String> roles;
    }
}
