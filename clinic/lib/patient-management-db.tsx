"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { patientAPI, type Patient } from "../lib/database"

// All your existing UI components (Button, Card, Input, etc.) remain exactly the same
// [Keep all the UI components from your working version]

// Button component with inline styles
function Button({
  children,
  variant = "default",
  size = "default",
  onClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className = "",
  disabled = false,
  ...props
}: {
  children: React.ReactNode
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg"
  onClick?: () => void
  className?: string
  disabled?: boolean
  [key: string]: unknown
}) {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "6px",
    fontWeight: "500",
    fontSize: size === "sm" ? "14px" : "16px",
    padding: size === "sm" ? "6px 12px" : "10px 16px",
    border: "1px solid",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all 0.2s",
  }

  const variants = {
    default: {
      backgroundColor: "#2563eb",
      color: "white",
      borderColor: "#2563eb",
    },
    outline: {
      backgroundColor: "white",
      color: "#374151",
      borderColor: "#d1d5db",
    },
    secondary: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      borderColor: "#d1d5db",
    },
  }

  return (
    <button style={{ ...baseStyle, ...variants[variant] }} onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  )
}

// [Keep all other UI components exactly as they were - Card, Input, Select, Table, etc.]
// ... (All the same UI components from your working version)

// Icons
const PlusIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const UserIcon = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

export default function PatientManagementDB() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [, setIsModalOpen] = useState(false)
  const [, setEditingPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState({
    totalPatients: 0,
    activePatients: 0,
    inactivePatients: 0,
    activeMale: 0,
    activeFemale: 0,
  })
  const [, setFormData] = useState<Omit<Patient, "id">>({
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

  // Load patients from database
  const loadPatients = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await patientAPI.getAll()
      setPatients(data)
    } catch (err) {
      setError("Failed to load patients from database")
      console.error("Error loading patients:", err)
    } finally {
      setLoading(false)
    }
  }

  // Load statistics from database
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


  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Loading Overlay */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1001,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "24px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  border: "2px solid #e5e7eb",
                  borderTop: "2px solid #2563eb",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
              <span>Loading...</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "6px",
              border: "1px solid #fecaca",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                color: "#dc2626",
                padding: "0 4px",
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* Header - Same as your working version */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "16px",
              }}
            >
              <div>
                <h1 style={{ fontSize: "32px", fontWeight: "bold", color: "#111827", margin: 0, marginBottom: "4px" }}>
                  Patient Management
                </h1>
                <p style={{ color: "#6b7280", margin: 0 }}>Manage patient records and information</p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} disabled={loading}>
                <PlusIcon />
                <span style={{ marginLeft: "8px" }}>Add Patient</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Stats - Updated with database statistics */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", maxWidth: "300px", flex: 1 }}>
            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}>
              <SearchIcon />
            </div>
            <input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px 8px 40px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ color: "#2563eb" }}>
                  <UserIcon />
                </div>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {statistics.totalPatients}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Total Patients</p>
                </div>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {statistics.activePatients}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Table - Same structure as your working version */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ padding: "24px", paddingBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0, marginBottom: "4px" }}>
              Patient Records
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Showing {patients.length} patients from database
            </p>
          </div>
          <div style={{ padding: "0 24px 24px 24px" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Name
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Date of Birth
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Contact
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Blood Type
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Status
                    </th>
                    <th
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#6b7280",
                        backgroundColor: "#f9fafb",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr
                      key={patient.id}
                      style={{ borderBottom: "1px solid #f3f4f6" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb"
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white"
                      }}
                    >
                      <td style={{ padding: "12px 16px", color: "#111827" }}>
                        <div>
                          <p style={{ fontWeight: "500", margin: 0, marginBottom: "2px" }}>
                            {`${patient.firstName} ${patient.lastName}`}
                          </p>
                          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{patient.email}</p>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#111827" }}>
                        <div>
                          <p style={{ margin: 0, marginBottom: "2px" }}>
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{patient.gender}</p>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#111827" }}>{patient.phone}</td>
                      <td style={{ padding: "12px 16px", color: "#111827" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: "white",
                            color: "#374151",
                            border: "1px solid #d1d5db",
                          }}
                        >
                          {patient.bloodType}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#111827" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: patient.status === "Active" ? "#dbeafe" : "#f3f4f6",
                            color: patient.status === "Active" ? "#1e40af" : "#374151",
                            border: patient.status === "Active" ? "1px solid #93c5fd" : "1px solid #d1d5db",
                          }}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#111827" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(patient)} disabled={loading}>
                            <EditIcon />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(patient.id)}
                            disabled={loading}
                          >
                            <TrashIcon />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {patients.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <div style={{ color: "#9ca3af", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                  <UserIcon />
                </div>
                <p style={{ color: "#6b7280" }}>
                  {searchTerm ? "No patients found matching your search." : "No patients in database yet."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal - Same as your working version but with database integration */}
        {/* [Include the same modal code from your working version] */}
      </div>

      {/* Add CSS animation for loading spinner */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
