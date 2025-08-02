-- CureSync Database Setup for XAMPP MySQL
-- Run this script in phpMyAdmin or MySQL command line

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS curesync_db;
USE curesync_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS DoctorSchedules;
DROP TABLE IF EXISTS Users;

-- Create Users table (includes doctors, patients, and admins)
CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'admin') NOT NULL DEFAULT 'patient',
    phone VARCHAR(20),
    address TEXT,
    dateOfBirth DATE,
    gender ENUM('male', 'female', 'other'),
    
    -- Doctor specific fields
    specialization VARCHAR(100),
    licenseNumber VARCHAR(50),
    experience INT,
    
    -- Patient specific fields
    bloodGroup VARCHAR(10),
    emergencyContact VARCHAR(20),
    
    -- Common fields
    isActive BOOLEAN DEFAULT TRUE,
    lastLogin DATETIME,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes for better performance
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_isActive (isActive)
);

-- Create DoctorSchedules table
CREATE TABLE DoctorSchedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctorId INT NOT NULL,
    hospitalName VARCHAR(255) NOT NULL,
    hospitalAddress TEXT NOT NULL,
    dayOfWeek ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    startTime TIME NOT NULL,
    endTime TIME NOT NULL,
    consultationFee DECIMAL(10, 2) NOT NULL,
    maxPatients INT NOT NULL DEFAULT 20,
    isActive BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (doctorId) REFERENCES Users(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_doctorId (doctorId),
    INDEX idx_dayOfWeek (dayOfWeek),
    INDEX idx_isActive (isActive)
);

-- Create Appointments table
CREATE TABLE Appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    scheduleId INT NOT NULL,
    appointmentDate DATE NOT NULL,
    appointmentTime TIME NOT NULL,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show') DEFAULT 'scheduled',
    symptoms TEXT,
    previousReports JSON,
    notes TEXT,
    consultationFee DECIMAL(10, 2) NOT NULL,
    paymentStatus ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    paymentMethod VARCHAR(50),
    paymentTransactionId VARCHAR(100),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraints
    FOREIGN KEY (patientId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (scheduleId) REFERENCES DoctorSchedules(id) ON DELETE CASCADE,
    
    -- Indexes
    INDEX idx_patientId (patientId),
    INDEX idx_doctorId (doctorId),
    INDEX idx_appointmentDate (appointmentDate),
    INDEX idx_status (status)
);

-- Insert sample doctors
INSERT INTO Users (name, email, password, role, phone, address, dateOfBirth, gender, specialization, licenseNumber, experience, isActive) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', '+1-555-0101', '123 Medical Center Dr, City Center', '1980-05-15', 'female', 'Cardiology', 'MD123456', 15, TRUE),
('Dr. Michael Chen', 'michael.chen@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', '+1-555-0102', '456 Health Plaza, Downtown', '1975-08-22', 'male', 'Neurology', 'MD123457', 20, TRUE),
('Dr. Emily Rodriguez', 'emily.rodriguez@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', '+1-555-0103', '789 Care Street, Medical District', '1985-03-10', 'female', 'Pediatrics', 'MD123458', 12, TRUE),
('Dr. David Williams', 'david.williams@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', '+1-555-0104', '321 Wellness Ave, Health Center', '1978-11-30', 'male', 'Orthopedics', 'MD123459', 18, TRUE),
('Dr. Lisa Patel', 'lisa.patel@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'doctor', '+1-555-0105', '654 Medical Blvd, Care District', '1982-07-18', 'female', 'Dermatology', 'MD123460', 14, TRUE);

-- Insert sample patients
INSERT INTO Users (name, email, password, role, phone, address, dateOfBirth, gender, bloodGroup, emergencyContact, isActive) VALUES
('John Smith', 'john.smith@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', '+1-555-0201', '123 Patient Street, City', '1990-01-15', 'male', 'A+', '+1-555-0202', TRUE),
('Jane Doe', 'jane.doe@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'patient', '+1-555-0203', '456 Health Street, Town', '1985-06-20', 'female', 'O+', '+1-555-0204', TRUE);

-- Insert sample admin
INSERT INTO Users (name, email, password, role, isActive) VALUES
('Admin User', 'admin@curesync.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', TRUE);

-- Insert sample doctor schedules
INSERT INTO DoctorSchedules (doctorId, hospitalName, hospitalAddress, dayOfWeek, startTime, endTime, consultationFee, maxPatients, isActive) VALUES
-- Dr. Sarah Johnson (Cardiology) - Monday, Wednesday, Friday
(1, 'City General Hospital', '123 Main Street, City Center', 'monday', '09:00:00', '17:00:00', 150.00, 20, TRUE),
(1, 'Metro Medical Center', '456 Oak Avenue, Downtown', 'wednesday', '10:00:00', '18:00:00', 180.00, 15, TRUE),
(1, 'City General Hospital', '123 Main Street, City Center', 'friday', '08:00:00', '16:00:00', 150.00, 25, TRUE),
(1, 'Specialty Medical Center', '789 Specialty Drive, Medical District', 'tuesday', '11:00:00', '19:00:00', 200.00, 12, TRUE),

-- Dr. Michael Chen (Neurology) - Monday, Wednesday, Friday, Tuesday
(2, 'City General Hospital', '123 Main Street, City Center', 'monday', '09:00:00', '17:00:00', 150.00, 20, TRUE),
(2, 'Metro Medical Center', '456 Oak Avenue, Downtown', 'wednesday', '10:00:00', '18:00:00', 180.00, 15, TRUE),
(2, 'City General Hospital', '123 Main Street, City Center', 'friday', '08:00:00', '16:00:00', 150.00, 25, TRUE),
(2, 'Specialty Medical Center', '789 Specialty Drive, Medical District', 'tuesday', '11:00:00', '19:00:00', 200.00, 12, TRUE),

-- Dr. Emily Rodriguez (Pediatrics) - Monday, Wednesday, Friday, Thursday
(3, 'City General Hospital', '123 Main Street, City Center', 'monday', '09:00:00', '17:00:00', 150.00, 20, TRUE),
(3, 'Metro Medical Center', '456 Oak Avenue, Downtown', 'wednesday', '10:00:00', '18:00:00', 180.00, 15, TRUE),
(3, 'City General Hospital', '123 Main Street, City Center', 'friday', '08:00:00', '16:00:00', 150.00, 25, TRUE),
(3, 'Family Care Clinic', '321 Family Street, Care District', 'thursday', '09:00:00', '17:00:00', 120.00, 18, TRUE),

-- Dr. David Williams (Orthopedics) - Monday, Wednesday, Friday
(4, 'City General Hospital', '123 Main Street, City Center', 'monday', '09:00:00', '17:00:00', 150.00, 20, TRUE),
(4, 'Metro Medical Center', '456 Oak Avenue, Downtown', 'wednesday', '10:00:00', '18:00:00', 180.00, 15, TRUE),
(4, 'City General Hospital', '123 Main Street, City Center', 'friday', '08:00:00', '16:00:00', 150.00, 25, TRUE),

-- Dr. Lisa Patel (Dermatology) - Monday, Wednesday, Friday, Thursday
(5, 'City General Hospital', '123 Main Street, City Center', 'monday', '09:00:00', '17:00:00', 150.00, 20, TRUE),
(5, 'Metro Medical Center', '456 Oak Avenue, Downtown', 'wednesday', '10:00:00', '18:00:00', 180.00, 15, TRUE),
(5, 'City General Hospital', '123 Main Street, City Center', 'friday', '08:00:00', '16:00:00', 150.00, 25, TRUE),
(5, 'Family Care Clinic', '321 Family Street, Care District', 'thursday', '09:00:00', '17:00:00', 120.00, 18, TRUE);

-- Show the created data
SELECT 'Database setup completed successfully!' as status;

-- Display sample doctors
SELECT 'Sample Doctors:' as info;
SELECT id, name, email, specialization, experience FROM Users WHERE role = 'doctor';

-- Display sample patients
SELECT 'Sample Patients:' as info;
SELECT id, name, email, bloodGroup FROM Users WHERE role = 'patient';

-- Display sample schedules
SELECT 'Sample Doctor Schedules:' as info;
SELECT 
    ds.id,
    u.name as doctor_name,
    ds.hospitalName,
    ds.dayOfWeek,
    ds.startTime,
    ds.endTime,
    ds.consultationFee
FROM DoctorSchedules ds
JOIN Users u ON ds.doctorId = u.id
LIMIT 10; 