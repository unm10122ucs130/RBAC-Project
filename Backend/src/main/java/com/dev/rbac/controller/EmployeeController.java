package com.dev.rbac.controller;

import com.dev.rbac.model.Employee;
import com.dev.rbac.service.EmployeeService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    /*  read  */

    @GetMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<List<Employee>> getAllEmployees() {
        return ResponseEntity.ok(employeeService.getAllEmployees());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_READ')")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(employeeService.getEmployeeById(id));
    }

    //create

    @PostMapping
    @PreAuthorize("hasAuthority('EMPLOYEE_CREATE')")
    public ResponseEntity<Employee> createEmployee(
            @RequestBody CreateEmployeeRequest request
    ) {
        Employee employee = new Employee();
        employee.setName(request.getName());
        employee.setEmail(request.getEmail());
        employee.setDepartment(request.getDepartment());
        employee.setSalary(request.getSalary());

        return ResponseEntity.ok(employeeService.createEmployee(employee));
    }

    /* update  */

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_UPDATE')")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @RequestBody UpdateEmployeeRequest request
    ) {
        return ResponseEntity.ok(
                employeeService.updateEmployee(id, request)
        );
    }

    //delete

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('EMPLOYEE_DELETE')")
    public ResponseEntity<?> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok().build();
    }

    /*   -------  DTOs ----- */

    @Data
    public static class CreateEmployeeRequest {
        private String name;
        private String email;
        private String department;
        private Double salary;
    }

    @Data
    public static class UpdateEmployeeRequest {
        private String name;
        private String department;
        private Double salary;
    }
}
