## Role Based Access Control Application

A modern, enterprise-grade Role-Based Access Control (RBAC) system with Employee and Project management modules. Built with Spring Boot, React, and MySQL.

<h3>1. Project Overview</h3>

This is a full-stack RBAC (Role-Based Access Control) system that provides secure access management for enterprise applications. The system allows administrators to manage users, roles, permissions, employees, and projects through an intuitive web interface.

<h3>2. Key Features</h3>

·  JWT-based authentication & authorization

·  User management with role assignment

·  Employee management with profiles

·  Project management with assignments

·  Role-based permission configuration

·  Interactive dashboard with analytics

·  Fully responsive Material-UI design

·  High-performance REST API

·  Secure password encryption (BCrypt)

<h3>3. Data Models</h3>

Core Entities

1. Users - System users with credentials and profiles
2. Roles - Groups of permissions (ADMIN, MANAGER, USER)
3. Permissions - Fine-grained access controls
4. Employees - Company employees with detailed profiles
5. Projects - Company projects with team assignments

 
<h3>4. Quick Start</h3>

Prerequisites

· Java 17+

· Node.js 18+

· MySQL 8.0+

· Maven 3.6+

. Spring Boot 3.5+

. React JS 18.2+

· Git 



Step 1: Clone & Setup

```bash
# Clone repository
git clone https://github.com/unm10122ucs130/RBAC-Project.git
cd rbac-project
```

Step 2: Database Setup

```bash
# Create database
mysql -u root -p
CREATE DATABASE rbac_system;
EXIT;

# Or use provided script
mysql -u root -p < database/rbac_schema.sql
```

Step 3: Backend Setup (Spring Boot)

```bash
cd backend

# Configure database (update application.properties)
# Update: spring.datasource.url, username, password

# Build and run
mvn clean install
mvn spring-boot:run
```

Backend runs on: http://localhost:777

Step 4: Frontend Setup (React)

```bash
cd frontend

# Install Vite Build tool and Dependencies
npm create vite@latest 

# Start development server
npm run dev
```

Frontend runs on: http://localhost:5173

<h3>4. Sample Login Credentials</h3>

Default Admin Account

· Username: admin

· Password: admin123

· Role: ADMIN (Full access)


Default Users & Access Levels

| Username | Password   | Role     | Access Level                 |
|----------|------------|----------|------------------------------|
| manager  | manager123 | MANAGER  | Moderate access              |
| user     | user123    | USER     | Basic access                 |
| employee | emp123     | EMPLOYEE | Employee management access   |


<h3>5. API Endpoints</h3>

Authentication

· POST /api/auth/login - User login

· POST /api/auth/register - User registration

User Management

· GET /api/users - List all users

· POST /api/users - Create user

· PUT /api/users/{id} - Update user

· DELETE /api/users/{id} - Delete user

Role Management

· GET /api/roles - List all roles

· POST /api/roles - Create role

· PUT /api/roles/{id} - Update role

· DELETE /api/roles/{id} - Delete role

Employee Management

· GET /api/employees - List all employees

· GET /api/employees/{id} - Get employee details

· POST /api/employees - Create employee

· PUT /api/employees/{id} - Update employee

· DELETE /api/employees/{id} - Delete employee

· GET /api/employees/department/{dept} - Get by department

Project Management

· GET /api/projects - List all projects

· GET /api/projects/{id} - Get project details

· POST /api/projects - Create project

· PUT /api/projects/{id} - Update project

· DELETE /api/projects/{id} - Delete project

· POST /api/projects/{id}/assign/{employeeId} - Assign employee to project

· DELETE /api/projects/{id}/remove/{employeeId} - Remove employee from project

<h3>6. Project Structure</h3> 

```
rbac-system/
├── backend/                 # Spring Boot Application
│   ├── src/main/java/com/rbac/
│   │   ├── controller/     # REST Controllers
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── RoleController.java
│   │   │   ├── EmployeeController.java   # New
│   │   │   └── ProjectController.java    # New
│   │   ├── model/         # JPA Entities
│   │   │   ├── User.java
│   │   │   ├── Role.java
│   │   │   ├── Permission.java
│   │   │   ├── Employee.java    # New
│   │   │   └── Project.java     # New
│   │   ├── repository/    # Data Access Layer
│   │   │   ├── UserRepository.java
│   │   │   ├── RoleRepository.java
│   │   │   ├── EmployeeRepository.java   # New
│   │   │   └── ProjectRepository.java    # New
│   │   ├── service/       # Business Logic
│   │   │   ├── UserService.java
│   │   │   ├── RoleService.java
│   │   │   ├── EmployeeService.java   # New
│   │   │   └── ProjectService.java    # New
│   │   └── security/      # JWT & Security
│   └── application.properties
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/    # UI Components
│   │   ├── pages/        # Page Components
│   │   │   ├── Login.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Users.js
│   │   │   ├── Roles.js
│   │   │   ├── Employees.js   # New
│   │   │   └── Projects.js    # New
│   │   ├── services/     # API Services
│   │   │   ├── authService.js
│   │   │   ├── userService.js
│   │   │   ├── employeeService.js   # New
│   │   │   └── projectService.js    # New
│   │   └── context/      # React Context
│   └── package.json
└── database/              # SQL Scripts
    └── rbac_schema.sql
```


<h3>7. Testing</h3>

Backend Tests

```bash
cd backend
mvn test
```

Frontend Tests

```bash
cd frontend
npm test
```

<h3>8. Security & Permissions</h3>

User Permissions

. USER_CREATE - Create new users

. USER_READ - View user details

. USER_UPDATE - Update user information

. USER_DELETE - Delete users

Role Permissions 

. ROLE_CREATE - Create new roles

. ROLE_READ - View role details

. ROLE_UPDATE - Update role information

. ROLE_DELETE - Delete roles

Permission Permissions 

. PERMISSION_CREATE - Create new permissions

. PERMISSION_READ - View permission details

. PERMISSION_UPDATE - Update permission information

. PERMISSION_DELETE - Delete permissions

Employee Permissions 

· EMPLOYEE_CREATE - Create new employees

· EMPLOYEE_READ - View employee details

· EMPLOYEE_UPDATE - Update employee information

· EMPLOYEE_DELETE - Delete employees

Project Permissions 

· PROJECT_CREATE - Create new projects

· PROJECT_READ - View project details

· PROJECT_UPDATE - Update project information

· PROJECT_DELETE - Delete projects


<h3>9. Acknowledgments</h3>

· Spring Boot

· React

· Material-UI

· MySQL

---

⭐ If you find this project useful, please give it a star!

For support, open an issue on GitHub.
