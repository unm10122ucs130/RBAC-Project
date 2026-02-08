-- database/rbac_schema.sql

CREATE DATABASE IF NOT EXISTS rbac_system;
USE rbac_system;

-- Users table
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permissions table
CREATE TABLE permissions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Role mapping
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Role-Permission mapping
CREATE TABLE role_permissions (
    role_id BIGINT NOT NULL,
    permission_id BIGINT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Configurations table
CREATE TABLE configurations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    config_type VARCHAR(50) DEFAULT 'STRING',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

--insert values

INSERT INTO roles (name, description) VALUES 
('ADMIN', 'System Administrator with full access'),
('MANAGER', 'Manager with limited administrative access'),
('USER', 'Regular user with basic permissions');


INSERT INTO permissions (name, description, resource, action) VALUES 
('USER_CREATE', 'Create new users', 'USER', 'CREATE'),
('USER_READ', 'View users', 'USER', 'READ'),
('USER_UPDATE', 'Update users', 'USER', 'UPDATE'),
('USER_DELETE', 'Delete users', 'USER', 'DELETE'),
('ROLE_CREATE', 'Create roles', 'ROLE', 'CREATE'),
('ROLE_READ', 'View roles', 'ROLE', 'READ'),
('ROLE_UPDATE', 'Update roles', 'ROLE', 'UPDATE'),
('ROLE_DELETE', 'Delete roles', 'ROLE', 'DELETE');


INSERT INTO permissions (name, description, resource, action) VALUES
('PERMISSION_CREATE', 'Create permissions', 'PERMISSION', 'CREATE'),
('PERMISSION_READ',   'View permissions',   'PERMISSION', 'READ'),
('PERMISSION_UPDATE', 'Update permissions', 'PERMISSION', 'UPDATE'),
('PERMISSION_DELETE', 'Delete permissions', 'PERMISSION', 'DELETE');


INSERT INTO employees (name, description, resource, action) VALUES
('EMPLOYEE_CREATE', 'Create employees', 'EMPLOYEE', 'CREATE'),
('EMPLOYEE_READ',   'View employees',   'EMPLOYEE', 'READ'),
('EMPLOYEE_UPDATE', 'Update employees', 'EMPLOYEE', 'UPDATE'),
('EMPLOYEE_DELETE', 'Delete employees', 'EMPLOYEE', 'DELETE');

INSERT INTO employees (name, description, resource, action) VALUES
('PROJECT_CREATE', 'Create projects', 'PROJECT', 'CREATE'),
('PROJECT_READ',   'View projects',   'PROJECT', 'READ'),
('PROJECT_UPDATE', 'Update projects', 'PROJECT', 'UPDATE'),
('PROJECT_DELETE', 'Delete projects', 'PROJECT', 'DELETE');

-- Assign permissions to ADMIN role
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p 
WHERE r.name = 'ADMIN';

-- Assign ADMIN role to admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u, roles r 
WHERE u.username = 'admin' AND r.name = 'ADMIN';