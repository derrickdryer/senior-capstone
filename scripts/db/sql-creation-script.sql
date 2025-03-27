-- Database: realtor_website

CREATE DATABASE IF NOT EXISTS realtor_website;
USE realtor_website;

-- Table: users
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role ENUM('manager', 'maintenance', 'tenant') NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Table: assets
CREATE TABLE IF NOT EXISTS assets (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(10) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    num_apartments INT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);

-- Table: apartments
CREATE TABLE IF NOT EXISTS apartments (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    unit_number VARCHAR(10) NOT NULL,
    floor INT NOT NULL,
    bedrooms DECIMAL(2, 1) NOT NULL,
    bathrooms DECIMAL(2, 1) NOT NULL,
    square_footage DECIMAL(10, 2) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY (property_id) REFERENCES assets(property_id) ON DELETE CASCADE
);

-- Table: tenants
CREATE TABLE IF NOT EXISTS tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Table: leases
CREATE TABLE IF NOT EXISTS leases (
    lease_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'terminated', 'pending') NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE
);

-- Table: payments
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'check') NOT NULL,
    status ENUM('completed', 'pending', 'failed') NOT NULL,
    FOREIGN KEY (lease_id) REFERENCES leases(lease_id) ON DELETE CASCADE
);

-- Table: maintenance_requests
CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    request_date DATE NOT NULL,
    issue_description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL,
    completion_date DATE,
    assigned_to VARCHAR(50),
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    apartment_id INT DEFAULT NULL,
    image_url JSON NOT NULL, -- Store image URL as a JSON array
    caption VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (property_id) REFERENCES assets(property_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE
);

-- Table: invoices
CREATE TABLE IF NOT EXISTS invoices (
    invoice_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,  -- New due_date column for invoice due dates
    total_amount DECIMAL(10, 2) NOT NULL,
    charges JSON NOT NULL, -- Stores charge breakdown as JSON
    status ENUM('unpaid', 'paid', 'overdue') NOT NULL,
    FOREIGN KEY (lease_id) REFERENCES leases(lease_id) ON DELETE CASCADE
);

-- Insert dummy data into users
INSERT INTO users (role, username, password, email) VALUES
('manager', 'manager1', '$2b$10$kB88Uv2gq.Ql61GLr4Yhc.SeoyR6vr1qZ87np5oLYlznl6doCaHwa', 'manager1@example.com'), 
('maintenance', 'maintenance1', '$2b$10$lU7RabR1fMM/0jSMWtCFQOMcy4k7OPyolZNccCOYRhZ1ZBk8MpNaG', 'maintenance1@example.com'),
('tenant', 'tenant1', '$2b$10$x3jIxgCkfA0s1UMkYVpC9edTY.Gxdx.P304qOzKbtRK3/adHjYUhS', 'tenant1@example.com');


-- Insert dummy data into assets
INSERT INTO assets (address, city, state, postal_code, num_apartments) VALUES
('123 Main St', 'Springfield', 'IL', '62701', 10),
('456 Elm St', 'Springfield', 'IL', '62702', 8),
('789 Oak St', 'Springfield', 'IL', '62703', 12);

-- Insert dummy data into apartments
INSERT INTO apartments (property_id, unit_number, floor, bedrooms, bathrooms, square_footage, rent_amount) VALUES  
(1, '1A', 1, 2, 1, 850.00, 1200.00),
(1, '1B', 1, 3, 2, 1050.00, 1500.00),
(2, '2A', 2, 1, 1, 650.00, 900.00),
(2, '2B', 2, 2, 1, 800.00, 1100.00),
(3, '3A', 3, 3, 2, 1200.00, 1800.00);

-- Insert dummy data into tenants
INSERT INTO tenants (first_name, last_name, email, phone_number, user_id) VALUES
('John', 'Doe', 'john.doe@example.com', '555-1234', 3),
('Jane', 'Smith', 'jane.smith@example.com', '555-5678', 3),
('Alice', 'Johnson', 'alice.johnson@example.com', '555-8765', 3);

-- Insert dummy data into leases
INSERT INTO leases (tenant_id, apartment_id, lease_start_date, lease_end_date, monthly_rent, security_deposit, status) VALUES
(1, 1, '2025-01-01', '2025-12-31', 1200.00, 1200.00, 'active'),
(2, 2, '2025-02-01', '2026-01-31', 1500.00, 1500.00, 'active'),
(3, 3, '2025-03-01', '2026-02-28', 900.00, 900.00, 'active');

-- Insert dummy data into payments
INSERT INTO payments (lease_id, payment_date, amount, payment_method, status) VALUES
(1, '2025-02-01', 1200.00, 'credit_card', 'completed'),
(2, '2025-02-01', 1500.00, 'bank_transfer', 'completed'),
(3, '2025-02-01', 900.00, 'check', 'completed');

-- Insert dummy data into maintenance_requests
INSERT INTO maintenance_requests (tenant_id, apartment_id, request_date, issue_description, status, completion_date, assigned_to) VALUES
(1, 1, '2025-02-01', 'Leaky faucet', 'completed', '2025-02-02', 'Bob'),
(2, 2, '2025-02-03', 'Broken window', 'in_progress', NULL, 'Alice'),
(3, 3, '2025-02-05', 'No hot water', 'pending', NULL, NULL);

-- Insert dummy data into invoices
INSERT INTO invoices (lease_id, invoice_date, due_date, total_amount, charges, status) VALUES
(1, '2025-02-01', '2025-02-10', 1200.00, '[{"description": "Rent", "amount": 1200.00}]', 'paid'),
(2, '2025-02-01', '2025-02-10', 1500.00, '[{"description": "Rent", "amount": 1500.00}]', 'paid'),
(3, '2025-03-01', '2025-03-15', 900.00, '[{"description": "Rent", "amount": 900.00}]', 'unpaid');