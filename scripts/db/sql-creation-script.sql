-- Database: realtor_website

CREATE DATABASE IF NOT EXISTS realtor_website;
USE realtor_website;

-- Table: Property
CREATE TABLE Property (
    property_id INT AUTO_INCREMENT PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(10) NOT NULL,
    postal_code VARCHAR(10) NOT NULL,
    num_apartments INT NOT NULL
);

-- Table: Apartment
CREATE TABLE Apartment (
    apartment_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT NOT NULL,
    unit_number VARCHAR(10) NOT NULL,
    floor INT NOT NULL,
    bedrooms DECIMAL(2, 1) NOT NULL,
    bathrooms DECIMAL(2, 1) NOT NULL,
    square_footage DECIMAL(10, 2) NOT NULL,
    rent_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (property_id) REFERENCES Property(property_id) ON DELETE CASCADE
);

-- Table: Tenant
CREATE TABLE Tenant (
    tenant_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15) NOT NULL
);

-- Table: Leases
CREATE TABLE Leases (
    lease_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    lease_start_date DATE NOT NULL,
    lease_end_date DATE NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) NOT NULL,
    status ENUM('active', 'terminated', 'pending') NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES Apartment(apartment_id) ON DELETE CASCADE
);

-- Table: Payment
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    lease_id INT NOT NULL,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('credit_card', 'bank_transfer', 'check') NOT NULL,
    status ENUM('completed', 'pending', 'failed') NOT NULL,
    FOREIGN KEY (lease_id) REFERENCES Leases(lease_id) ON DELETE CASCADE
);

-- Table: MaintenanceRequest
CREATE TABLE MaintenanceRequest (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT NOT NULL,
    apartment_id INT NOT NULL,
    request_date DATE NOT NULL,
    issue_description TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') NOT NULL,
    completion_date DATE,
    assigned_to VARCHAR(50),
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenant_id) ON DELETE CASCADE,
    FOREIGN KEY (apartment_id) REFERENCES Apartment(apartment_id) ON DELETE CASCADE
);

-- Table: User
CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT,
    role ENUM('manager', 'maintenance', 'tenant') NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    mfa_secret VARCHAR(255),
    FOREIGN KEY (property_id) REFERENCES Property(property_id) ON DELETE SET NULL
);

-- Table: Notifications
CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_date DATE NOT NULL,
    read_status VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Table: Inquiry
CREATE TABLE Inquiry (
    inquiry_id INT AUTO_INCREMENT PRIMARY KEY,
    tenant_id INT,
    property_id INT,
    apartment_id INT,
    inquiry_content TEXT NOT NULL,
    response_date DATE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15) NOT NULL,
    FOREIGN KEY (tenant_id) REFERENCES Tenant(tenant_id) ON DELETE SET NULL,
    FOREIGN KEY (property_id) REFERENCES Property(property_id) ON DELETE SET NULL,
    FOREIGN KEY (apartment_id) REFERENCES Apartment(apartment_id) ON DELETE SET NULL
);
