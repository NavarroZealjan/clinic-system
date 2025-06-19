import { promises as fs } from "fs";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "patients.json");

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read patients from file
async function readPatients(): Promise<Patient[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // File doesn't exist, return initial data
    const initialPatients: Patient[] = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-06-15",
        gender: "Male",
        phone: "(555) 123-4567",
        email: "john.doe@email.com",
        address: "123 Main St, City, State 12345",
        bloodType: "O+",
        allergies: "Penicillin",
        emergencyContact: "Jane Doe",
        emergencyPhone: "(555) 987-6543",
        insuranceProvider: "Blue Cross",
        insuranceNumber: "BC123456789",
        medicalHistory: "Hypertension, managed with medication",
        status: "Active",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 2,
        firstName: "Sarah",
        lastName: "Johnson",
        dateOfBirth: "1992-03-22",
        gender: "Female",
        phone: "(555) 234-5678",
        email: "sarah.johnson@email.com",
        address: "456 Oak Ave, City, State 12345",
        bloodType: "A-",
        allergies: "None known",
        emergencyContact: "Mike Johnson",
        emergencyPhone: "(555) 876-5432",
        insuranceProvider: "Aetna",
        insuranceNumber: "AE987654321",
        medicalHistory: "No significant medical history",
        status: "Active",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
    ];
    await writePatients(initialPatients);
    return initialPatients;
  }
}

// Write patients to file
async function writePatients(patients: Patient[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(patients, null, 2));
}

export const patientAPI = {
  async getAll(): Promise<Patient[]> {
    const patients = await readPatients();
    return patients.filter((p) => p.status === "Active");
  },

  async search(searchTerm: string): Promise<Patient[]> {
    const patients = await readPatients();
    const term = searchTerm.toLowerCase();
    return patients.filter(
      (p) =>
        p.status === "Active" &&
        (p.firstName.toLowerCase().includes(term) ||
          p.lastName.toLowerCase().includes(term) ||
          p.email.toLowerCase().includes(term) ||
          p.phone.includes(term))
    );
  },

  async add(
    patient: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    const patients = await readPatients();
    const newId = Math.max(...patients.map((p) => p.id), 0) + 1;
    const newPatient: Patient = {
      ...patient,
      id: newId,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    patients.push(newPatient);
    await writePatients(patients);
    return newPatient;
  },

  async update(
    id: number,
    patientData: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    const patients = await readPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Patient not found");

    const updatedPatient: Patient = {
      ...patients[index],
      ...patientData,
      id,
      updatedDate: new Date().toISOString(),
    };
    patients[index] = updatedPatient;
    await writePatients(patients);
    return updatedPatient;
  },

  async delete(id: number): Promise<void> {
    const patients = await readPatients();
    const index = patients.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Patient not found");

    patients[index].status = "Inactive";
    patients[index].updatedDate = new Date().toISOString();
    await writePatients(patients);
  },

  async getStatistics(): Promise<{
    totalPatients: number;
    activePatients: number;
    inactivePatients: number;
    activeMale: number;
    activeFemale: number;
  }> {
    const patients = await readPatients();
    return {
      totalPatients: patients.length,
      activePatients: patients.filter((p) => p.status === "Active").length,
      inactivePatients: patients.filter((p) => p.status === "Inactive").length,
      activeMale: patients.filter(
        (p) => p.status === "Active" && p.gender === "Male"
      ).length,
      activeFemale: patients.filter(
        (p) => p.status === "Active" && p.gender === "Female"
      ).length,
    };
  },
};
