package com.dev.rbac.service;

import com.dev.rbac.model.Permission;
import com.dev.rbac.repository.PermissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PermissionService {
    
    private final PermissionRepository permissionRepository;
    
    public Permission createPermission(Permission permission) {
        return permissionRepository.save(permission);
    }
    
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }
    
    public List<Permission> getPermissionsByResource(String resource) {
        return permissionRepository.findByResource(resource);
    }
    
    public Permission updatePermission(Long id, Permission permissionDetails) {
        Permission permission = getPermissionById(id);
        permission.setDescription(permissionDetails.getDescription());
        return permissionRepository.save(permission);
    }
    
    public void deletePermission(Long id) {
        permissionRepository.deleteById(id);
    }
    
    private Permission getPermissionById(Long id) {
        return permissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permission not found"));
    }
}