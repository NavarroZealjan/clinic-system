-- Create the Patients table
USE PatientManagementDB;
GO

CREATE TABLE Patients
(
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    DateOfBirth DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL,
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    Address NVARCHAR(255),
    BloodType NVARCHAR(5),
    Allergies NVARCHAR(500),
    EmergencyContact NVARCHAR(100),
    EmergencyPhone NVARCHAR(20),
    InsuranceProvider NVARCHAR(100),
    InsuranceNumber NVARCHAR(50),
    MedicalHistory NVARCHAR(1000),
    Status NVARCHAR(10) DEFAULT 'Active' CHECK (Status IN ('Active', 'Inactive')),
    CreatedDate DATETIME2 DEFAULT GETDATE(),
    UpdatedDate DATETIME2 DEFAULT GETDATE(),
    IsDeleted BIT DEFAULT 0
);
GO

-- Create indexes for better performance
CREATE INDEX IX_Patients_Status ON Patients(Status);
CREATE INDEX IX_Patients_LastName ON Patients(LastName);
CREATE INDEX IX_Patients_Email ON Patients(Email);
GO

PRINT '✅ Patients table created successfully!';
