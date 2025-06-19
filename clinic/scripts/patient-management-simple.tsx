"use client"

import { useState, useEffect } from "react"
// Update the import path if the file exists elsewhere, for example:
import { patientAPI, type Patient } from "../lib/simple-storage"
// Or, if the file does not exist, create 'simple-storage.ts' in the 'lib' folder with the necessary exports.

// [Keep all your existing UI components - Button, Card, Input, etc.]
// All the same UI components from your working version

export default function PatientManagementSimple() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalPatients: 0,
    activePatients: 0,
    inactivePatients: 0,
    activeMale: 0,
    activeFemale: 0,
  })
  const [formData, setFormData] = useState<Omit<Patient, "id">>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    bloodType: "",
    allergies: "",
    emergencyContact: "",
    emergencyPhone: "",
    insuranceProvider: "",
    insuranceNumber: "",
    medicalHistory: "",
    status: "Active",
  })

  // Load patients and statistics on component mount
  useEffect(() => {
    loadPatients()
    loadStatistics()
  }, [])

  // Load patients from storage
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await patientAPI.getAll()
      setPatients(data)
    } catch (err) {
      setError("Failed to load patients")
      console.error("Error loading patients:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load statistics
  const loadStatistics = async () => {
    try {
      const stats = await patientAPI.getStatistics()
      setStatistics(stats)
    } catch (err) {
      console.error("Error loading statistics:", err)
    }
  }

  // Search patients with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        try {
          setLoading(true)
          const data = await patientAPI.search(searchTerm)
          setPatients(data)
        } catch (err) {
          setError("Failed to search patients")
          console.error("Error searching patients:", err)
        } finally {
          setLoading(false)
        }
      } else {
        loadPatients()
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  const handleInputChange = (field: keyof Omit<Patient, "id">, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      setError(null)

      if (editingPatient) {
        await patientAPI.update(editingPatient.id, formData)
      } else {
        await patientAPI.add(formData)
      }

      await loadPatients()
      await loadStatistics()
      resetForm()
      setIsModalOpen(false)
    } catch (err) {
      setError(editingPatient ? "Failed to update patient" : "Failed to add patient")
      console.error("Error saving patient:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      emergencyContact: patient.emergencyContact,
      emergencyPhone: patient.emergencyPhone,
      insuranceProvider: patient.insuranceProvider,
      insuranceNumber: patient.insuranceNumber,
      medicalHistory: patient.medicalHistory,
      status: patient.status,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (patientId: number) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      try {
        setLoading(true)
        setError(null)
        await patientAPI.delete(patientId)
        await loadPatients()
        await loadStatistics()
      } catch (err) {
        setError("Failed to delete patient")
        console.error("Error deleting patient:", err)
      } finally {
        setLoading(false)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      bloodType: "",
      allergies: "",
      emergencyContact: "",
      emergencyPhone: "",
      insuranceProvider: "",
      insuranceNumber: "",
      medicalHistory: "",
      status: "Active",
    })
    setEditingPatient(null)
  }

  // Export data function
  const handleExportData = async () => {
    try {
      const data = await patientAPI.exportData()
      const blob = new Blob([data], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `patients-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      setError("Failed to export data")
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Success Message */}
        <div
          style={{
            backgroundColor: "#d1fae5",
            color: "#065f46",
            padding: "12px 16px",
            borderRadius: "6px",
            border: "1px solid #a7f3d0",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span>✅</span>
          <span>Patient Management System is working with local storage! Data persists between sessions.</span>
          <button
            onClick={handleExportData}
            style={{
              marginLeft: "auto",
              background: "none",
              border: "1px solid #065f46",
              color: "#065f46",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Export Data
          </button>
        </div>

        {/* Rest of your existing UI components */}
        {/* [Include all the same header, search, table, and modal components from your working version] */}
      </div>
    </div>
  )
}
