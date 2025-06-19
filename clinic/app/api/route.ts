import { type NextRequest, NextResponse } from "next/server";
import sql from "mssql";

// Database configuration
const config = {
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "PatientManagementDB",
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: true, // For local development
  },
};

// GET - Get all patients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("search");

    await sql.connect(config);

    let result;
    if (searchTerm) {
      result = await sql.query`
        EXEC SearchPatients @SearchTerm = ${searchTerm}
      `;
    } else {
      result = await sql.query`EXEC GetAllPatients`;
    }

    const patients = result.recordset.map((row) => ({
      id: row.Id,
      firstName: row.FirstName,
      lastName: row.LastName,
      dateOfBirth: row.DateOfBirth.toISOString().split("T")[0],
      gender: row.Gender,
      phone: row.Phone,
      email: row.Email,
      address: row.Address,
      bloodType: row.BloodType,
      allergies: row.Allergies,
      emergencyContact: row.EmergencyContact,
      emergencyPhone: row.EmergencyPhone,
      insuranceProvider: row.InsuranceProvider,
      insuranceNumber: row.InsuranceNumber,
      medicalHistory: row.MedicalHistory,
      status: row.Status,
      createdDate: row.CreatedDate,
      updatedDate: row.UpdatedDate,
    }));

    return NextResponse.json(patients);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to fetch patients" },
      { status: 500 }
    );
  } finally {
    await sql.close();
  }
}

// POST - Add new patient
export async function POST(request: NextRequest) {
  try {
    const patient = await request.json();

    await sql.connect(config);

    const result = await sql.query`
      EXEC AddPatient 
        @FirstName = ${patient.firstName},
        @LastName = ${patient.lastName},
        @DateOfBirth = ${patient.dateOfBirth},
        @Gender = ${patient.gender},
        @Phone = ${patient.phone},
        @Email = ${patient.email},
        @Address = ${patient.address},
        @BloodType = ${patient.bloodType},
        @Allergies = ${patient.allergies},
        @EmergencyContact = ${patient.emergencyContact},
        @EmergencyPhone = ${patient.emergencyPhone},
        @InsuranceProvider = ${patient.insuranceProvider},
        @InsuranceNumber = ${patient.insuranceNumber},
        @MedicalHistory = ${patient.medicalHistory},
        @Status = ${patient.status}
    `;

    const newPatientId = result.recordset[0].NewPatientId;

    return NextResponse.json({
      id: newPatientId,
      ...patient,
      message: "Patient added successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to add patient" },
      { status: 500 }
    );
  } finally {
    await sql.close();
  }
}
