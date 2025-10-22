"use client"

import { useState } from "react"
import OrderForm from "../OrderForm/OrderForm"
import OrderStatus from "../OrderStatus/OrderStatus"

const OrderModal = ({ isOpen, onClose, platform, serviceType }) => {
  const [activeTab, setActiveTab] = useState("order")
  const [orderResult, setOrderResult] = useState(null)

  if (!isOpen) return null

  const handleOrderCreated = (result) => {
    setOrderResult(result)
    setActiveTab("status")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {platform} {serviceType}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
              ×
            </button>
          </div>

          <div className="flex border-b mb-6">
            <button
              onClick={() => setActiveTab("order")}
              className={`px-4 py-2 font-medium ${
                activeTab === "order"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Place Order
            </button>
            <button
              onClick={() => setActiveTab("status")}
              className={`px-4 py-2 font-medium ${
                activeTab === "status"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Check Status
            </button>
          </div>

          {activeTab === "order" && (
            <OrderForm platform={platform} serviceType={serviceType} onOrderCreated={handleOrderCreated} />
          )}

          {activeTab === "status" && (
            <div>
              {orderResult && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">
                    Order created successfully! Order number: <strong>{orderResult.orderNumber}</strong>
                  </p>
                </div>
              )}
              <OrderStatus />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderModal
