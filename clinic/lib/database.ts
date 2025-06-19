import sql from "mssql";

// Database configuration
const config: sql.config = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "your_password",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_NAME || "PatientManagementDB",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies: string;
  emergencyContact: string;
  emergencyPhone: string;
  insuranceProvider: string;
  insuranceNumber: string;
  medicalHistory: string;
  status: "Active" | "Inactive";
  createdDate?: string;
  updatedDate?: string;
}

// Database connection pool
let pool: sql.ConnectionPool | null = null;

async function getConnection() {
  if (!pool) {
    pool = new sql.ConnectionPool(config);
    await pool.connect();
  }
  return pool;
}

export const patientAPI = {
  // Get all patients
  async getAll(): Promise<Patient[]> {
    try {
      const connection = await getConnection();
      const result = await connection.request().execute("GetAllPatients");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.recordset.map((row: any) => ({
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
        status: row.Status as "Active" | "Inactive",
        createdDate: row.CreatedDate,
        updatedDate: row.UpdatedDate,
      }));
    } catch (error) {
      console.error("Error fetching patients:", error);
      throw new Error("Failed to fetch patients");
    }
  },

  // Search patients
  async search(searchTerm: string): Promise<Patient[]> {
    try {
      const connection = await getConnection();
      const result = await connection
        .request()
        .input("SearchTerm", sql.NVarChar(100), searchTerm)
        .execute("SearchPatients");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return result.recordset.map((row: any) => ({
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
        status: row.Status as "Active" | "Inactive",
        createdDate: row.CreatedDate,
        updatedDate: row.UpdatedDate,
      }));
    } catch (error) {
      console.error("Error searching patients:", error);
      throw new Error("Failed to search patients");
    }
  },

  // Add new patient
  async add(
    patient: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    try {
      const connection = await getConnection();
      const result = await connection
        .request()
        .input("FirstName", sql.NVarChar(50), patient.firstName)
        .input("LastName", sql.NVarChar(50), patient.lastName)
        .input("DateOfBirth", sql.Date, patient.dateOfBirth)
        .input("Gender", sql.NVarChar(10), patient.gender)
        .input("Phone", sql.NVarChar(20), patient.phone)
        .input("Email", sql.NVarChar(100), patient.email)
        .input("Address", sql.NVarChar(255), patient.address)
        .input("BloodType", sql.NVarChar(5), patient.bloodType)
        .input("Allergies", sql.NVarChar(500), patient.allergies)
        .input("EmergencyContact", sql.NVarChar(100), patient.emergencyContact)
        .input("EmergencyPhone", sql.NVarChar(20), patient.emergencyPhone)
        .input(
          "InsuranceProvider",
          sql.NVarChar(100),
          patient.insuranceProvider
        )
        .input("InsuranceNumber", sql.NVarChar(50), patient.insuranceNumber)
        .input("MedicalHistory", sql.NVarChar(1000), patient.medicalHistory)
        .input("Status", sql.NVarChar(10), patient.status)
        .execute("AddPatient");

      const newPatientId = result.recordset[0].NewPatientId;

      return {
        id: newPatientId,
        ...patient,
      };
    } catch (error) {
      console.error("Error adding patient:", error);
      throw new Error("Failed to add patient");
    }
  },

  // Update patient
  async update(
    id: number,
    patient: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    try {
      const connection = await getConnection();
      await connection
        .request()
        .input("Id", sql.Int, id)
        .input("FirstName", sql.NVarChar(50), patient.firstName)
        .input("LastName", sql.NVarChar(50), patient.lastName)
        .input("DateOfBirth", sql.Date, patient.dateOfBirth)
        .input("Gender", sql.NVarChar(10), patient.gender)
        .input("Phone", sql.NVarChar(20), patient.phone)
        .input("Email", sql.NVarChar(100), patient.email)
        .input("Address", sql.NVarChar(255), patient.address)
        .input("BloodType", sql.NVarChar(5), patient.bloodType)
        .input("Allergies", sql.NVarChar(500), patient.allergies)
        .input("EmergencyContact", sql.NVarChar(100), patient.emergencyContact)
        .input("EmergencyPhone", sql.NVarChar(20), patient.emergencyPhone)
        .input(
          "InsuranceProvider",
          sql.NVarChar(100),
          patient.insuranceProvider
        )
        .input("InsuranceNumber", sql.NVarChar(50), patient.insuranceNumber)
        .input("MedicalHistory", sql.NVarChar(1000), patient.medicalHistory)
        .input("Status", sql.NVarChar(10), patient.status)
        .execute("UpdatePatient");

      return {
        id,
        ...patient,
      };
    } catch (error) {
      console.error("Error updating patient:", error);
      throw new Error("Failed to update patient");
    }
  },

  // Delete patient (soft delete)
  async delete(id: number): Promise<void> {
    try {
      const connection = await getConnection();
      await connection
        .request()
        .input("Id", sql.Int, id)
        .execute("DeletePatient");
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw new Error("Failed to delete patient");
    }
  },

  // Get patient statistics
  async getStatistics(): Promise<{
    totalPatients: number;
    activePatients: number;
    inactivePatients: number;
    activeMale: number;
    activeFemale: number;
  }> {
    try {
      const connection = await getConnection();
      const result = await connection.request().execute("GetPatientStatistics");

      const stats = result.recordset[0];
      return {
        totalPatients: stats.TotalPatients,
        activePatients: stats.ActivePatients,
        inactivePatients: stats.InactivePatients,
        activeMale: stats.ActiveMale,
        activeFemale: stats.ActiveFemale,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw new Error("Failed to fetch statistics");
    }
  },
};
