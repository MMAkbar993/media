"use client"

import { useState } from "react"
import { useOrderStatus } from "../../hooks/useApi"

const OrderStatus = () => {
  const [orderNumber, setOrderNumber] = useState("")
  const [searchOrderNumber, setSearchOrderNumber] = useState("")

  const { data: orderData, loading, error, refetch } = useOrderStatus(searchOrderNumber)

  const handleSearch = (e) => {
    e.preventDefault()
    if (orderNumber.trim()) {
      setSearchOrderNumber(orderNumber.trim())
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100"
      case "processing":
      case "in_progress":
        return "text-blue-600 bg-blue-100"
      case "failed":
      case "cancelled":
        return "text-red-600 bg-red-100"
      case "partial":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Check Order Status</h3>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter your order number (e.g., ORD-1234567890-ABCDE)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            disabled={loading || !orderNumber.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {orderData && orderData.success && (
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-700">Order Details</h4>
                <p>
                  <span className="font-medium">Order Number:</span> {orderData.data.orderNumber}
                </p>
                <p>
                  <span className="font-medium">Platform:</span> {orderData.data.platform}
                </p>
                <p>
                  <span className="font-medium">Service:</span> {orderData.data.serviceType}
                </p>
                <p>
                  <span className="font-medium">Quantity:</span> {orderData.data.quantity}
                </p>
                <p>
                  <span className="font-medium">Amount:</span> ${orderData.data.amount} {orderData.data.currency}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700">Progress</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium">Status:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(orderData.data.status)}`}
                  >
                    {orderData.data.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
                <p>
                  <span className="font-medium">Delivered:</span> {orderData.data.deliveredQuantity || 0}
                </p>
                <p>
                  <span className="font-medium">Progress:</span> {orderData.data.completionPercentage || 0}%
                </p>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${orderData.data.completionPercentage || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Timestamps</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Created:</span> {formatDate(orderData.data.createdAt)}
                </p>
                {orderData.data.startedAt && (
                  <p>
                    <span className="font-medium">Started:</span> {formatDate(orderData.data.startedAt)}
                  </p>
                )}
                {orderData.data.completedAt && (
                  <p>
                    <span className="font-medium">Completed:</span> {formatDate(orderData.data.completedAt)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {orderData.data.logs && orderData.data.logs.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {orderData.data.logs.map((log, index) => (
                  <div key={index} className="flex justify-between items-start text-sm">
                    <span className="text-gray-600">{log.message}</span>
                    <span className="text-gray-400 text-xs">{formatDate(log.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={refetch}
            className="w-full py-2 px-4 border border-orange-500 text-orange-500 rounded-md hover:bg-orange-50 transition-colors"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  )
}

export default OrderStatus
