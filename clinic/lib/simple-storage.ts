"use client";

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

// Initial sample data
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
  {
    id: 3,
    firstName: "Michael",
    lastName: "Brown",
    dateOfBirth: "1978-11-08",
    gender: "Male",
    phone: "(555) 345-6789",
    email: "michael.brown@email.com",
    address: "789 Pine St, City, State 12345",
    bloodType: "B+",
    allergies: "Shellfish",
    emergencyContact: "Lisa Brown",
    emergencyPhone: "(555) 765-4321",
    insuranceProvider: "Cigna",
    insuranceNumber: "CG456789123",
    medicalHistory: "Type 2 Diabetes, well controlled",
    status: "Active",
    createdDate: new Date().toISOString(),
    updatedDate: new Date().toISOString(),
  },
];

// Storage key for localStorage
const STORAGE_KEY = "patient-management-data";

// Get patients from localStorage or return initial data
function getStoredPatients(): Patient[] {
  if (typeof window === "undefined") return initialPatients;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  // If no stored data, save initial data and return it
  savePatients(initialPatients);
  return initialPatients;
}

// Save patients to localStorage
function savePatients(patients: Patient[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

// Simulate async operations for consistency with database API
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const patientAPI = {
  async getAll(): Promise<Patient[]> {
    await delay(100); // Simulate network delay
    const patients = getStoredPatients();
    return patients.filter((p) => p.status === "Active");
  },

  async search(searchTerm: string): Promise<Patient[]> {
    await delay(100);
    const patients = getStoredPatients();
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
    patientData: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    await delay(100);
    const patients = getStoredPatients();
    const newId = Math.max(...patients.map((p) => p.id), 0) + 1;

    const newPatient: Patient = {
      ...patientData,
      id: newId,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    patients.push(newPatient);
    savePatients(patients);
    return newPatient;
  },

  async update(
    id: number,
    patientData: Omit<Patient, "id" | "createdDate" | "updatedDate">
  ): Promise<Patient> {
    await delay(100);
    const patients = getStoredPatients();
    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("Patient not found");
    }

    const updatedPatient: Patient = {
      ...patients[index],
      ...patientData,
      id,
      updatedDate: new Date().toISOString(),
    };

    patients[index] = updatedPatient;
    savePatients(patients);
    return updatedPatient;
  },

  async delete(id: number): Promise<void> {
    await delay(100);
    const patients = getStoredPatients();
    const index = patients.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error("Patient not found");
    }

    patients[index].status = "Inactive";
    patients[index].updatedDate = new Date().toISOString();
    savePatients(patients);
  },

  async getStatistics(): Promise<{
    totalPatients: number;
    activePatients: number;
    inactivePatients: number;
    activeMale: number;
    activeFemale: number;
  }> {
    await delay(100);
    const patients = getStoredPatients();

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

  // Utility function to export data
  async exportData(): Promise<string> {
    const patients = getStoredPatients();
    return JSON.stringify(patients, null, 2);
  },

  // Utility function to import data
  async importData(jsonData: string): Promise<void> {
    try {
      const patients = JSON.parse(jsonData) as Patient[];
      savePatients(patients);
    } catch (error) {
      throw new Error("Invalid JSON data");
    }
  },

  // Clear all data (for testing)
  async clearAll(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },
};
