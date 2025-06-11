"use client"

import React, { useState } from "react"

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
          })
        }
        if (React.isValidElement(child) && child.type === SelectContent) {
          return isOpen
            ? React.cloneElement(child, {
                onSelect: (selectedValue: string) => {
                  onValueChange(selectedValue)
                  setIsOpen(false)
                },
                currentValue: value,
              })
            : null
        }
        return child
      })}
    </div>
  )
}

export function SelectTrigger({
  children,
  onClick,
  isOpen,
}: { children: React.ReactNode; onClick?: () => void; isOpen?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

export function SelectValue({ placeholder }: { placeholder: string }) {
  return <span className="text-gray-400">{placeholder}</span>
}

export function SelectContent({
  children,
  onSelect,
  currentValue,
}: { children: React.ReactNode; onSelect?: (value: string) => void; currentValue?: string }) {
  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-lg">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onSelect, currentValue })
        }
        return child
      })}
    </div>
  )
}

export function SelectItem({
  value,
  children,
  onSelect,
  currentValue,
}: SelectItemProps & { onSelect?: (value: string) => void; currentValue?: string }) {
  return (
    <div
      className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${currentValue === value ? "bg-blue-50 text-blue-600" : ""}`}
      onClick={() => onSelect?.(value)}
    >
      {children}
    </div>
  )
}
