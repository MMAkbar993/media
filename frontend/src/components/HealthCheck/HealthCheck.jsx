"use client"

import { useState, useEffect } from "react"
import apiService from "../../services/api"

const HealthCheck = () => {
  const [status, setStatus] = useState("checking")
  const [healthData, setHealthData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      setStatus("checking")
      setError(null)
      const response = await apiService.healthCheck()
      setHealthData(response)
      setStatus(response.status === "healthy" ? "healthy" : "unhealthy")
    } catch (err) {
      setError(err.message)
      setStatus("unhealthy")
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-100"
      case "unhealthy":
        return "text-red-600 bg-red-100"
      case "checking":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "healthy":
        return "✅"
      case "unhealthy":
        return "❌"
      case "checking":
        return "⏳"
      default:
        return "❓"
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getStatusIcon()}</span>
          <span className="font-medium">Backend Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {status.toUpperCase()}
          </span>
        </div>

        <button
          onClick={checkHealth}
          disabled={status === "checking"}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}

      {healthData && healthData.services && (
        <div className="mt-2 text-sm text-gray-600">
          <span>Database: {healthData.services.database}</span>
          <span className="mx-2">•</span>
          <span>Redis: {healthData.services.redis}</span>
        </div>
      )}
    </div>
  )
}

export default HealthCheck
