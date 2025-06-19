import { type NextRequest, NextResponse } from "next/server";
import sql from "mssql";

// Database configuration
const config = {
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "PatientManagementDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// PUT - Update patient
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patient = await request.json();
    const patientId = Number.parseInt(params.id);

    await sql.connect(config);

    await sql.query`
      EXEC UpdatePatient 
        @Id = ${patientId},
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

    return NextResponse.json({
      id: patientId,
      ...patient,
      message: "Patient updated successfully",
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  } finally {
    await sql.close();
  }
}

// DELETE - Delete patient
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = Number.parseInt(params.id);

    await sql.connect(config);

    await sql.query`EXEC DeletePatient @Id = ${patientId}`;

    return NextResponse.json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to delete patient" },
      { status: 500 }
    );
  } finally {
    await sql.close();
  }
}
