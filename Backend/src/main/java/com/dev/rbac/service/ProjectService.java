package com.dev.rbac.service;

import com.dev.rbac.model.Project;
import com.dev.rbac.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    /* Read */

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    /* Create*/

    public Project createProject(Project project) {

        if (projectRepository.existsByName(project.getName())) {
            throw new RuntimeException("Project name already exists");
        }

        return projectRepository.save(project);
    }

    //update

    @Transactional
    public Project updateProject(Long id, UpdateProjectRequest request) {

        Project project = getProjectById(id);

        project.setDescription(request.description());
        project.setStatus(request.status());
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());

        return project;
    }

    //delete

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    /* Dto */

    public record UpdateProjectRequest(
            String description,
            String status,
            java.time.LocalDateTime startDate,
            java.time.LocalDateTime endDate
    ) {}
}
