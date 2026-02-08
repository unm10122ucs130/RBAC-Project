package com.dev.rbac.repository;

import com.dev.rbac.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    boolean existsByName(String name);
}
