package com.dev.rbac.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.dev.rbac.model.Role;
import com.dev.rbac.model.User;
import com.dev.rbac.repository.RoleRepository;
import com.dev.rbac.repository.UserRepository;

@Configuration
@Profile("dev") // VERY IMPORTANT
public class DataInitializer {

    @Bean
    CommandLineRunner seedAdmin(
            RoleRepository roleRepo,
            UserRepository userRepo,
            PasswordEncoder encoder) {

        return args -> {

            // Create ADMIN role if not exists
            Role adminRole = roleRepo.findByName("ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        role.setDescription("System Administrator with full access");
                        return roleRepo.save(role);
                    });

            // Create admin user if not exists
            userRepo.findByUsername("admin")
                    .orElseGet(() -> {
                        User admin = new User();
                        admin.setUsername("admin");
                        admin.setEmail("admin@rbac.local");
                        admin.setPassword(encoder.encode("admin123")); // encode ONCE
                        admin.getRoles().add(adminRole);
                        return userRepo.save(admin);
                    });
        };
    }
}
