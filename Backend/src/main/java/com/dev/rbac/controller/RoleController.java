package com.dev.rbac.controller;

import com.dev.rbac.model.Role;
import com.dev.rbac.service.RoleService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {
    
    private final RoleService roleService;
    
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_READ')")
    public ResponseEntity<List<Role>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }
    
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_CREATE')")
    public ResponseEntity<Role> createRole(@RequestBody CreateRoleRequest request) {
        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());
        
        Role createdRole = roleService.createRole(role, request.getPermissions());
        return ResponseEntity.ok(createdRole);
    }
    
    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasAuthority('ROLE_UPDATE')")
    public ResponseEntity<Role> updateRolePermissions(
            @PathVariable Long id,
            @RequestBody UpdatePermissionsRequest request) {
        Role updatedRole = roleService.updateRolePermissions(id, request.getPermissions());
        return ResponseEntity.ok(updatedRole);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_DELETE')")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.ok().build();
    }
    
    @Data
    public static class CreateRoleRequest {
        private String name;
        private String description;
        private Set<String> permissions;
    }
    
    @Data
    public static class UpdatePermissionsRequest {
        private Set<String> permissions;
    }
}