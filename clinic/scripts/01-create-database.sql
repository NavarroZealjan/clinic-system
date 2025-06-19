-- Create the PatientManagementDB database
USE master;
GO

-- Drop database if it exists (for clean setup)
IF EXISTS (SELECT name
FROM sys.databases
WHERE name = 'PatientManagementDB')
BEGIN
    DROP DATABASE PatientManagementDB;
END
GO

-- Create the database
CREATE DATABASE PatientManagementDB;
GO

-- Use the new database
USE PatientManagementDB;
GO

PRINT '✅ Database PatientManagementDB created successfully!';
