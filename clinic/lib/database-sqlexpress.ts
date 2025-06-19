import sql from "mssql";

// SQL Server Express configuration with Windows Authentication
const config: sql.config = {
  server: process.env.DB_SERVER || "localhost\\SQLEXPRESS",
  database: process.env.DB_NAME || "PatientManagementDB",
  authentication: {
    type: "default", // Use Windows Authentication
    options: {
      // For Windows Authentication, leave userName and password undefined
      // If you want to use SQL Authentication, provide userName and password here
    },
  },
  options: {
    encrypt: false, // Set to false for local development
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
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

// Create a connection pool
let pool: sql.ConnectionPool | null = null;

async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    if (!pool) {
      console.log("Creating new SQL Server connection pool...");
      pool = new sql.ConnectionPool(config);

      pool.on("error", (err) => {
        console.error("Database pool error:", err);
        pool = null; // Reset pool on error
      });

      await pool.connect();
      console.log("✅ Connected to SQL Server Express successfully");
    }

    return pool;
  } catch (error) {
    console.error("❌ Failed to connect to SQL Server:", error);
    pool = null;
    throw new Error(`Database connection failed: ${error}`);
  }
}

export const patientAPI = {
  async getAll(): Promise<Patient[]> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
      const result = await connection.request().execute("GetAllPatients");

      return result.recordset.map((row: any) => ({
        id: row.Id,
        firstName: row.FirstName || "",
        lastName: row.LastName || "",
        dateOfBirth: row.DateOfBirth
          ? row.DateOfBirth.toISOString().split("T")[0]
          : "",
        gender: row.Gender || "",
        phone: row.Phone || "",
        email: row.Email || "",
        address: row.Address || "",
        bloodType: row.BloodType || "",
        allergies: row.Allergies || "",
        emergencyContact: row.EmergencyContact || "",
        emergencyPhone: row.EmergencyPhone || "",
        insuranceProvider: row.InsuranceProvider || "",
        insuranceNumber: row.InsuranceNumber || "",
        medicalHistory: row.MedicalHistory || "",
        status: (row.Status as "Active" | "Inactive") || "Active",
        createdDate: row.CreatedDate?.toISOString(),
        updatedDate: row.UpdatedDate?.toISOString(),
      }));
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Reset connection pool on error
      if (pool) {
        try {
          await pool.close();
        } catch (closeError) {
          console.error("Error closing pool:", closeError);
        }
        pool = null;
      }
      throw new Error(`Failed to fetch patients: ${error}`);
    }
  },

  async search(searchTerm: string): Promise<Patient[]> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
      const result = await connection
        .request()
        .input("SearchTerm", sql.NVarChar(100), searchTerm)
        .execute("SearchPatients");

      return result.recordset.map((row: any) => ({
        id: row.Id,
        firstName: row.FirstName || "",
        lastName: row.LastName || "",
        dateOfBirth: row.DateOfBirth
          ? row.DateOfBirth.toISOString().split("T")[0]
          : "",
        gender: row.Gender || "",
        phone: row.Phone || "",
        email: row.Email || "",
        address: row.Address || "",
        bloodType: row.BloodType || "",
        allergies: row.Allergies || "",
        emergencyContact: row.EmergencyContact || "",
        emergencyPhone: row.EmergencyPhone || "",
        insuranceProvider: row.InsuranceProvider || "",
        insuranceNumber: row.InsuranceNumber || "",
        medicalHistory: row.MedicalHistory || "",
        status: (row.Status as "Active" | "Inactive") || "Active",
        createdDate: row.CreatedDate?.toISOString(),
        updatedDate: row.UpdatedDate?.toISOString(),
      }));
    } catch (error) {
      console.error("Error searching patients:", error);
      throw new Error(`Failed to search patients: ${error}`);
    }
  },

  async add(
    patient: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
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
      throw new Error(`Failed to add patient: ${error}`);
    }
  },

  async update(
    id: number,
    patient: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
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
      throw new Error(`Failed to update patient: ${error}`);
    }
  },

  async delete(id: number): Promise<void> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
      await connection
        .request()
        .input("Id", sql.Int, id)
        .execute("DeletePatient");
    } catch (error) {
      console.error("Error deleting patient:", error);
      throw new Error(`Failed to delete patient: ${error}`);
    }
  },

  async getStatistics(): Promise<{
    totalPatients: number;
    activePatients: number;
    inactivePatients: number;
    activeMale: number;
    activeFemale: number;
  }> {
    let connection: sql.ConnectionPool | null = null;
    try {
      connection = await getConnection();
      const result = await connection.request().execute("GetPatientStatistics");

      const stats = result.recordset[0] || {};
      return {
        totalPatients: stats.TotalPatients || 0,
        activePatients: stats.ActivePatients || 0,
        inactivePatients: stats.InactivePatients || 0,
        activeMale: stats.ActiveMale || 0,
        activeFemale: stats.ActiveFemale || 0,
      };
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return {
        totalPatients: 0,
        activePatients: 0,
        inactivePatients: 0,
        activeMale: 0,
        activeFemale: 0,
      };
    }
  },

  // Test connection function
  async testConnection(): Promise<boolean> {
    try {
      const connection = await getConnection();
      await connection.request().query("SELECT 1 as test");
      return true;
    } catch (error) {
      console.error("Connection test failed:", error);
      return false;
    }
  },
};

// Graceful shutdown
process.on("SIGINT", async () => {
  if (pool) {
    try {
      await pool.close();
      console.log("🔌 SQL Server Express connection closed");
    } catch (error) {
      console.error("Error closing connection:", error);
    }
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  if (pool) {
    try {
      await pool.close();
      console.log("🔌 SQL Server Express connection closed");
    } catch (error) {
      console.error("Error closing connection:", error);
    }
  }
  process.exit(0);
});
