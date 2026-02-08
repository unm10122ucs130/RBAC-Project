package com.dev.rbac.service;

import com.dev.rbac.model.Permission;
import com.dev.rbac.model.Role;
import com.dev.rbac.repository.PermissionRepository;
import com.dev.rbac.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoleService {
    
    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;
    
    public Role createRole(Role role, Set<String> permissionNames) {
        if (roleRepository.existsByName(role.getName())) {
            throw new RuntimeException("Role already exists");
        }
        
        Set<Permission> permissions = new HashSet<>();
        for (String permissionName : permissionNames) {
            Permission permission = permissionRepository.findByName(permissionName)
                    .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));
            permissions.add(permission);
        }
        role.setPermissions(permissions);
        
        return roleRepository.save(role);
    }
    
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
    
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
    }
  //   update   
    public Role updateRolePermissions(Long roleId, Set<String> permissionNames) {
        Role role = getRoleById(roleId);
        
        Set<Permission> permissions = new HashSet<>();
        for (String permissionName : permissionNames) {
            Permission permission = permissionRepository.findByName(permissionName)
                    .orElseThrow(() -> new RuntimeException("Permission not found: " + permissionName));
            permissions.add(permission);
        }
        role.setPermissions(permissions);
        
        return roleRepository.save(role);
    }

//   delete  
    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}