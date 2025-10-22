"use client"

import { useState } from "react"
import { useCreateOrder } from "../../hooks/useApi"

const OrderForm = ({ platform, serviceType, onOrderCreated }) => {
  const [formData, setFormData] = useState({
    targetUrl: "",
    quantity: "",
    email: "",
  })
  const [validationErrors, setValidationErrors] = useState({})
  const [toast, setToast] = useState({ visible: false, message: "" })

  const { createOrder, loading, error } = useCreateOrder()

  const validateForm = () => {
    const errors = {}

    if (!formData.targetUrl) {
      errors.targetUrl = "URL is required"
    } else if (!isValidUrl(formData.targetUrl)) {
      errors.targetUrl = "Please enter a valid URL"
    }

    if (!formData.quantity) {
      errors.quantity = "Quantity is required"
    } else if (formData.quantity < 1) {
      errors.quantity = "Quantity must be at least 1"
    }

    if (!formData.email) {
      errors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValidUrl = (url) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      const orderData = {
        platform,
        serviceType,
        targetUrl: formData.targetUrl,
        quantity: Number.parseInt(formData.quantity),
        email: formData.email,
      }

      const result = await createOrder(orderData)

      if (onOrderCreated) {
        onOrderCreated(result)
      }

      // Show success toast with order number
      if (result?.orderNumber) {
        setToast({ visible: true, message: `Order placed successfully. Order No: ${result.orderNumber}` })
        setTimeout(() => setToast({ visible: false, message: "" }), 4000)
      }

      // Reset form
      setFormData({
        targetUrl: "",
        quantity: "",
        email: "",
      })
    } catch (err) {
      console.error("Order creation failed:", err)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 relative">
      {toast.visible && (
        <div className="fixed right-4 top-4 z-50">
          <div className="bg-green-500 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 10-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.06l2.5 2.5a.75.75 0 001.14-.094l4.057-5.494z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{toast.message}</span>
            <button
              type="button"
              className="ml-2 text-white/80 hover:text-white"
              onClick={() => setToast({ visible: false, message: "" })}
              aria-label="Close toast"
            >
              ×
            </button>
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">
        Order {platform} {serviceType}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetUrl" className="block text-sm font-medium text-gray-700 mb-1">
            {platform === "instagram" ? "Instagram" : "TikTok"} URL
          </label>
          <input
            type="url"
            id="targetUrl"
            name="targetUrl"
            value={formData.targetUrl}
            onChange={handleInputChange}
            placeholder={`Enter your ${platform} post/profile URL`}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              validationErrors.targetUrl ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.targetUrl && <p className="text-red-500 text-sm mt-1">{validationErrors.targetUrl}</p>}
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            placeholder="Enter quantity"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              validationErrors.quantity ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.quantity && <p className="text-red-500 text-sm mt-1">{validationErrors.quantity}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              validationErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-semibold text-white transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Creating Order..." : "Place Order"}
        </button>
      </form>
    </div>
  )
}

export default OrderForm
