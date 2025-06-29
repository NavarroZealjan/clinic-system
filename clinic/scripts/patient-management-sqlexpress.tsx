"use client"

import React from "react"

import { useState, useEffect } from "react"
import { patientAPI, type Patient } from "./lib/database-sqlexpress"

// Button component with inline styles
function Button({
  children,
  variant = "default",
  size = "default",
  onClick,
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
  [key: string]: any
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

// Card components with inline styles
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CardHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "24px", paddingBottom: "16px" }}>{children}</div>
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0, marginBottom: "4px" }}>
      {children}
    </h3>
  )
}

function CardDescription({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{children}</p>
}

function CardContent({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "0 24px 24px 24px" }}>{children}</div>
}

// Input component
function Input({
  placeholder,
  value,
  onChange,
  type = "text",
  style = {},
  ...props
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
  style?: React.CSSProperties
  [key: string]: any
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        ...style,
      }}
      {...props}
    />
  )
}

// Label component
function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      style={{ display: "block", fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "4px" }}
    >
      {children}
    </label>
  )
}

// Select component
function Select({
  value,
  onValueChange,
  children,
}: {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          fontSize: "14px",
          backgroundColor: "white",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        {value || "Select an option"}
        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "white",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginTop: "4px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            zIndex: 50,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onSelect: (selectedValue: string) => {
                  onValueChange(selectedValue)
                  setIsOpen(false)
                },
              })
            }
            return child
          })}
        </div>
      )}
    </div>
  )
}

function SelectItem({
  value,
  children,
  onSelect,
}: {
  value: string
  children: React.ReactNode
  onSelect?: (value: string) => void
}) {
  return (
    <div
      onClick={() => onSelect?.(value)}
      style={{
        padding: "8px 12px",
        fontSize: "14px",
        cursor: "pointer",
        borderBottom: "1px solid #f3f4f6",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white"
      }}
    >
      {children}
    </div>
  )
}

// Table components
function Table({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>{children}</table>
    </div>
  )
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead>{children}</thead>
}

function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>
}

function TableRow({ children }: { children: React.ReactNode }) {
  return (
    <tr
      style={{ borderBottom: "1px solid #f3f4f6" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#f9fafb"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "white"
      }}
    >
      {children}
    </tr>
  )
}

function TableHead({ children }: { children: React.ReactNode }) {
  return (
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
      {children}
    </th>
  )
}

function TableCell({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "12px 16px", color: "#111827" }}>{children}</td>
}

// Textarea component
function Textarea({
  placeholder,
  value,
  onChange,
  rows = 3,
}: {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number
}) {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      style={{
        width: "100%",
        padding: "8px 12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "14px",
        outline: "none",
        resize: "none",
      }}
    />
  )
}

// Badge component
function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) {
  const variants = {
    default: { backgroundColor: "#dbeafe", color: "#1e40af", border: "1px solid #93c5fd" },
    secondary: { backgroundColor: "#f3f4f6", color: "#374151", border: "1px solid #d1d5db" },
    outline: { backgroundColor: "white", color: "#374151", border: "1px solid #d1d5db" },
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "500",
        ...variants[variant as keyof typeof variants],
      }}
    >
      {children}
    </span>
  )
}

// Modal component
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!isOpen) return null

  return (
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
        zIndex: 1000,
        padding: "16px",
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          maxWidth: "800px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "24px", borderBottom: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

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

export default function PatientManagementSQLExpress() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting")
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

  // Add this function after the state declarations
  const testConnection = async () => {
    try {
      const response = await fetch("/api/test-connection")
      const result = await response.json()

      if (result.success) {
        alert(
          `Database Connection Successful!\nPatients in database: ${result.patientCount}\nServer: ${result.server}\nDatabase: ${result.database}`,
        )
      } else {
        alert(
          `Database Connection Failed!\nError: ${result.error}\nServer: ${result.config?.server}\nDatabase: ${result.config?.database}`,
        )
      }
    } catch (error) {
      alert(`Connection Test Failed: ${error}`)
    }
  }

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
      setConnectionStatus("connecting")
      const data = await patientAPI.getAll()
      setPatients(data)
      setConnectionStatus("connected")
    } catch (err) {
      setError("Failed to connect to SQL Server Express database")
      setConnectionStatus("error")
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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Connection Status */}
        {connectionStatus === "connected" && (
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
            <span>🎉</span>
            <span>Successfully connected to SQL Server Express! Data is stored in PatientManagementDB.</span>
          </div>
        )}

        {connectionStatus === "error" && (
          <div
            style={{
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              padding: "12px 16px",
              borderRadius: "6px",
              border: "1px solid #fecaca",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>❌</span>
            <span>Failed to connect to SQL Server Express. Check your database setup and environment variables.</span>
          </div>
        )}

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
              <span>Loading from SQL Server...</span>
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

        {/* Header */}
        <Card>
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
                  Patient Management System
                </h1>
                <p style={{ color: "#6b7280", margin: 0 }}>
                  Connected to SQL Server Express - Professional Database Storage
                </p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} disabled={loading || connectionStatus === "error"}>
                <PlusIcon />
                <span style={{ marginLeft: "8px" }}>Add Patient</span>
              </Button>
              {/* Add a test button in the header section, after the "Add Patient" button: */}
              <Button onClick={testConnection} variant="outline">
                Test DB Connection
              </Button>
            </div>
          </div>
        </Card>

        {/* Search and Stats */}
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
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "40px" }}
              disabled={connectionStatus === "error"}
            />
          </div>
          <div style={{ display: "flex", gap: "16px" }}>
            <Card style={{ padding: "16px" }}>
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
            </Card>
            <Card style={{ padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", backgroundColor: "#10b981", borderRadius: "50%" }}></div>
                <div>
                  <p style={{ fontSize: "18px", fontWeight: "600", color: "#111827", margin: 0 }}>
                    {statistics.activePatients}
                  </p>
                  <p style={{ fontSize: "12px", color: "#6b7280", margin: 0 }}>Active</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Patient Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>
              {connectionStatus === "connected"
                ? `Showing ${patients.length} patients from SQL Server Express database`
                : "Database connection required to view patients"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionStatus === "connected" ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Blood Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <p style={{ fontWeight: "500", margin: 0, marginBottom: "2px" }}>
                            {`${patient.firstName} ${patient.lastName}`}
                          </p>
                          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{patient.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p style={{ margin: 0, marginBottom: "2px" }}>
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </p>
                          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>{patient.gender}</p>
                        </div>
                      </TableCell>
                      <TableCell>{patient.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{patient.bloodType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={patient.status === "Active" ? "default" : "secondary"}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <div style={{ color: "#9ca3af", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                  <UserIcon />
                </div>
                <p style={{ color: "#6b7280" }}>
                  {connectionStatus === "error"
                    ? "Unable to connect to SQL Server Express database"
                    : "Connecting to database..."}
                </p>
              </div>
            )}

            {patients.length === 0 && connectionStatus === "connected" && !loading && (
              <div style={{ textAlign: "center", padding: "48px" }}>
                <div style={{ color: "#9ca3af", marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                  <UserIcon />
                </div>
                <p style={{ color: "#6b7280" }}>
                  {searchTerm ? "No patients found matching your search." : "No patients in database yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Modal for Add/Edit Patient */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingPatient ? "Edit Patient" : "Add New Patient"}
        >
          <div style={{ padding: "24px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
              {/* Personal Information */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: 0,
                    paddingBottom: "8px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Personal Information
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="patient@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    placeholder="Enter full address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>

              {/* Medical Information */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    margin: 0,
                    paddingBottom: "8px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  Medical Information
                </h3>
                <div>
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select value={formData.bloodType} onValueChange={(value) => handleInputChange("bloodType", value)}>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    placeholder="List any known allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyContact">Emergency Contact</Label>
                  <Input
                    placeholder="Emergency contact name"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Emergency Phone</Label>
                  <Input
                    placeholder="(555) 987-6543"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    placeholder="Insurance company name"
                    value={formData.insuranceProvider}
                    onChange={(e) => handleInputChange("insuranceProvider", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="insuranceNumber">Insurance Number</Label>
                  <Input
                    placeholder="Insurance policy number"
                    value={formData.insuranceNumber}
                    onChange={(e) => handleInputChange("insuranceNumber", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Medical History & Status */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  margin: 0,
                  paddingBottom: "8px",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                Medical History & Status
              </h3>
              <div>
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Textarea
                  placeholder="Enter relevant medical history"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  rows={3}
                />
              </div>
              <div style={{ maxWidth: "200px" }}>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value as "Active" | "Inactive")}
                >
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </Select>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "12px",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
              }}
            >
              <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : editingPatient ? "Update Patient" : "Add Patient"}
              </Button>
            </div>
          </div>
        </Modal>
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
