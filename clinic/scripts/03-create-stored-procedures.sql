-- Create stored procedures for patient management
USE PatientManagementDB;
GO

-- Procedure to get all active patients
CREATE PROCEDURE GetAllPatients
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id, FirstName, LastName, DateOfBirth, Gender, Phone, Email,
        Address, BloodType, Allergies, EmergencyContact, EmergencyPhone,
        InsuranceProvider, InsuranceNumber, MedicalHistory, Status,
        CreatedDate, UpdatedDate
    FROM Patients
    WHERE IsDeleted = 0 AND Status = 'Active'
    ORDER BY LastName, FirstName;
END
GO

-- Procedure to search patients
CREATE PROCEDURE SearchPatients
    @SearchTerm NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        Id, FirstName, LastName, DateOfBirth, Gender, Phone, Email,
        Address, BloodType, Allergies, EmergencyContact, EmergencyPhone,
        InsuranceProvider, InsuranceNumber, MedicalHistory, Status,
        CreatedDate, UpdatedDate
    FROM Patients
    WHERE IsDeleted = 0
        AND Status = 'Active'
        AND (
            FirstName LIKE '%' + @SearchTerm + '%' OR
        LastName LIKE '%' + @SearchTerm + '%' OR
        Email LIKE '%' + @SearchTerm + '%' OR
        Phone LIKE '%' + @SearchTerm + '%'
        )
    ORDER BY LastName, FirstName;
END
GO

-- Procedure to add a new patient
CREATE PROCEDURE AddPatient
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @DateOfBirth DATE,
    @Gender NVARCHAR(10),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Address NVARCHAR(255),
    @BloodType NVARCHAR(5),
    @Allergies NVARCHAR(500),
    @EmergencyContact NVARCHAR(100),
    @EmergencyPhone NVARCHAR(20),
    @InsuranceProvider NVARCHAR(100),
    @InsuranceNumber NVARCHAR(50),
    @MedicalHistory NVARCHAR(1000),
    @Status NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @NewPatientId INT;

    INSERT INTO Patients
        (
        FirstName, LastName, DateOfBirth, Gender, Phone, Email, Address,
        BloodType, Allergies, EmergencyContact, EmergencyPhone,
        InsuranceProvider, InsuranceNumber, MedicalHistory, Status
        )
    VALUES
        (
            @FirstName, @LastName, @DateOfBirth, @Gender, @Phone, @Email, @Address,
            @BloodType, @Allergies, @EmergencyContact, @EmergencyPhone,
            @InsuranceProvider, @InsuranceNumber, @MedicalHistory, @Status
    );

    SET @NewPatientId = SCOPE_IDENTITY();

    SELECT @NewPatientId AS NewPatientId;
END
GO

-- Procedure to update a patient
CREATE PROCEDURE UpdatePatient
    @Id INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @DateOfBirth DATE,
    @Gender NVARCHAR(10),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Address NVARCHAR(255),
    @BloodType NVARCHAR(5),
    @Allergies NVARCHAR(500),
    @EmergencyContact NVARCHAR(100),
    @EmergencyPhone NVARCHAR(20),
    @InsuranceProvider NVARCHAR(100),
    @InsuranceNumber NVARCHAR(50),
    @MedicalHistory NVARCHAR(1000),
    @Status NVARCHAR(10)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Patients 
    SET 
        FirstName = @FirstName,
        LastName = @LastName,
        DateOfBirth = @DateOfBirth,
        Gender = @Gender,
        Phone = @Phone,
        Email = @Email,
        Address = @Address,
        BloodType = @BloodType,
        Allergies = @Allergies,
        EmergencyContact = @EmergencyContact,
        EmergencyPhone = @EmergencyPhone,
        InsuranceProvider = @InsuranceProvider,
        InsuranceNumber = @InsuranceNumber,
        MedicalHistory = @MedicalHistory,
        Status = @Status,
        UpdatedDate = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO

-- Procedure to delete a patient (soft delete)
CREATE PROCEDURE DeletePatient
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Patients 
    SET 
        IsDeleted = 1,
        Status = 'Inactive',
        UpdatedDate = GETDATE()
    WHERE Id = @Id;
END
GO

-- Procedure to get patient statistics
CREATE PROCEDURE GetPatientStatistics
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        COUNT(*) AS TotalPatients,
        SUM(CASE WHEN Status = 'Active' AND IsDeleted = 0 THEN 1 ELSE 0 END) AS ActivePatients,
        SUM(CASE WHEN Status = 'Inactive' OR IsDeleted = 1 THEN 1 ELSE 0 END) AS InactivePatients,
        SUM(CASE WHEN Status = 'Active' AND IsDeleted = 0 AND Gender = 'Male' THEN 1 ELSE 0 END) AS ActiveMale,
        SUM(CASE WHEN Status = 'Active' AND IsDeleted = 0 AND Gender = 'Female' THEN 1 ELSE 0 END) AS ActiveFemale
    FROM Patients;
END
GO

PRINT '✅ All stored procedures created successfully!';
