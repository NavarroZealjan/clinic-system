-- Insert sample patient data
USE PatientManagementDB;
GO

INSERT INTO Patients
    (
    FirstName, LastName, DateOfBirth, Gender, Phone, Email, Address,
    BloodType, Allergies, EmergencyContact, EmergencyPhone,
    InsuranceProvider, InsuranceNumber, MedicalHistory, Status
    )
VALUES
    (
        'John', 'Doe', '1985-06-15', 'Male', '(555) 123-4567', 'john.doe@email.com',
        '123 Main St, City, State 12345', 'O+', 'Penicillin', 'Jane Doe', '(555) 987-6543',
        'Blue Cross', 'BC123456789', 'Hypertension, managed with medication', 'Active'
),
    (
        'Sarah', 'Johnson', '1992-03-22', 'Female', '(555) 234-5678', 'sarah.johnson@email.com',
        '456 Oak Ave, City, State 12345', 'A-', 'None known', 'Mike Johnson', '(555) 876-5432',
        'Aetna', 'AE987654321', 'No significant medical history', 'Active'
),
    (
        'Michael', 'Brown', '1978-11-08', 'Male', '(555) 345-6789', 'michael.brown@email.com',
        '789 Pine St, City, State 12345', 'B+', 'Shellfish', 'Lisa Brown', '(555) 765-4321',
        'Cigna', 'CG456789123', 'Type 2 Diabetes, well controlled', 'Active'
),
    (
        'Emily', 'Davis', '1990-07-12', 'Female', '(555) 456-7890', 'emily.davis@email.com',
        '321 Elm St, City, State 12345', 'AB+', 'Latex', 'Robert Davis', '(555) 654-3210',
        'United Healthcare', 'UH789123456', 'Asthma, uses inhaler as needed', 'Active'
),
    (
        'David', 'Wilson', '1983-09-25', 'Male', '(555) 567-8901', 'david.wilson@email.com',
        '654 Maple Ave, City, State 12345', 'O-', 'None known', 'Jennifer Wilson', '(555) 543-2109',
        'Kaiser Permanente', 'KP456123789', 'Previous knee surgery in 2020', 'Active'
);
GO

PRINT 'Sample data inserted successfully!';
PRINT 'Total patients added: 5';

-- Verify the data
SELECT COUNT(*) AS TotalPatients
FROM Patients
WHERE IsDeleted = 0;
SELECT FirstName, LastName, Email, Status
FROM Patients
WHERE IsDeleted = 0;
