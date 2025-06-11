import type React from "react"

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table className={`w-full caption-bottom text-sm ${className}`}>{children}</table>
    </div>
  )
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return <thead className="[&_tr]:border-b">{children}</thead>
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="[&_tr:last-child]:border-0">{children}</tbody>
}

export function TableRow({ children }: { children: React.ReactNode }) {
  return <tr className="border-b transition-colors hover:bg-gray-50">{children}</tr>
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="h-12 px-4 text-left align-middle font-medium text-gray-600 [&:has([role=checkbox])]:pr-0">
      {children}
    </th>
  )
}

export function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{children}</td>
}
