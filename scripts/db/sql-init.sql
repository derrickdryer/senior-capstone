-- Database: realtor_website

CREATE DATABASE IF NOT EXISTS realtor_website;
USE realtor_website;

-- Table: assets
CREATE TABLE assets (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(10) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    num_apartments INT NOT NULL
);

-- Table: apartments
CREATE TABLE apartments (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    unit_number VARCHAR(10) NOT NULL,
    floor INT NOT NULL,
    bedrooms DECIMAL(2, 1) NOT NULL,
    bathrooms DECIMAL(2, 1) NOT NULL,
    square_footage DECIMAL(10, 2) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES assets(property_id) ON DELETE CASCADE
);

-- Table: tenants
CREATE TABLE tenants (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);

-- Table: leases
CREATE TABLE leases (
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
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'check') NOT NULL,
    status ENUM('completed', 'pending', 'failed') NOT NULL,
    FOREIGN KEY (lease_id) REFERENCES leases(lease_id) ON DELETE CASCADE
);

-- Table: maintenance_requests
CREATE TABLE maintenance_requests (
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

-- Table: users
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    role ENUM('manager', 'maintenance', 'tenant') NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    mfa_secret VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES assets(property_id) ON DELETE SET NULL
);

-- Table: notifications
CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_date DATE NOT NULL,
    read_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table: inquiries
CREATE TABLE inquiries (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    property_id INT,
    apartment_id INT,
    inquiry_content TEXT NOT NULL,
    response_date DATE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES tenants(tenant_id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES assets(property_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES apartments(apartment_id) ON DELETE CASCADE
);
