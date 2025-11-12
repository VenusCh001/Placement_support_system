import React from 'react'

export default function FormField({ label, children, error, hint }){
  return (
    <div className="mb-3">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>}
      <div>{children}</div>
      {hint && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{hint}</div>}
      {error && <div className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</div>}
    </div>
  )
}
