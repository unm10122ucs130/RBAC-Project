package com.dev.rbac.service;

import com.dev.rbac.controller.EmployeeController.UpdateEmployeeRequest;
import com.dev.rbac.model.Employee;
import com.dev.rbac.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    //read

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found"));
    }

    //Create

    public Employee createEmployee(Employee employee) {

        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new RuntimeException("Employee email already exists");
        }

        return employeeRepository.save(employee);
    }

    /* update*/

    @Transactional
    public Employee updateEmployee(Long id, UpdateEmployeeRequest request) {

        Employee employee = getEmployeeById(id);

        if (request.getName() != null) {
            employee.setName(request.getName());
        }
        if (request.getDepartment() != null) {
            employee.setDepartment(request.getDepartment());
        }
        if (request.getSalary() != null) {
            employee.setSalary(request.getSalary());
        }

        return employee;
    }

    /* delete */

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
