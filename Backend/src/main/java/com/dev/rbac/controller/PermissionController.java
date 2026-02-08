package com.dev.rbac.controller;

import com.dev.rbac.model.Permission;
import com.dev.rbac.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/permissions")
@RequiredArgsConstructor
public class PermissionController {

    private final PermissionRepository permissionRepository;

    /* Read  */

    // ADMIN or anyone with PERMISSION_VIEW
    @GetMapping
    @PreAuthorize("hasAuthority('PERMISSION_READ')")
    public ResponseEntity<List<Permission>> getAllPermissions() {
        return ResponseEntity.ok(permissionRepository.findAll());
    }

    /* create */

    @PostMapping
    @PreAuthorize("hasAuthority('PERMISSION_CREATE')")
    public ResponseEntity<Permission> createPermission( 
            @RequestBody Permission permission
    ) {
        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    //update

    //  ONLY AUTHORIZED USER CAN EDIT
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_UPDATE')")
    public ResponseEntity<Permission> updatePermission(
            @PathVariable Long id,
            @RequestBody Permission updatedPermission
    ) {
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));

        permission.setName(updatedPermission.getName());
        permission.setDescription(updatedPermission.getDescription());
        permission.setResource(updatedPermission.getResource());
        permission.setAction(updatedPermission.getAction());

        return ResponseEntity.ok(permissionRepository.save(permission));
    }

    // delete

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('PERMISSION_DELETE')")
    public ResponseEntity<?> deletePermission(@PathVariable Long id) {
        permissionRepository.deleteById(id);
        return ResponseEntity.ok("Permission deleted successfully");
    }
}
