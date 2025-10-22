"use client"

import { useState, useEffect } from "react"
import apiService from "../../services/api"

const ServicePricing = ({ platform, serviceType, onPriceCalculated }) => {
  const [serviceConfig, setServiceConfig] = useState(null)
  const [quantity, setQuantity] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServiceConfig = async () => {
      try {
        setLoading(true)
        setError(null)
        const config = await apiService.getServiceConfig(platform, serviceType)
        setServiceConfig(config.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (platform && serviceType) {
      fetchServiceConfig()
    }
  }, [platform, serviceType])

  useEffect(() => {
    if (serviceConfig && quantity) {
      const price = Number.parseFloat(quantity) * Number.parseFloat(serviceConfig.price_per_unit)
      setTotalPrice(price)

      if (onPriceCalculated) {
        onPriceCalculated({
          quantity: Number.parseInt(quantity),
          pricePerUnit: Number.parseFloat(serviceConfig.price_per_unit),
          totalPrice: price,
          serviceConfig,
        })
      }
    } else {
      setTotalPrice(0)
      if (onPriceCalculated) {
        onPriceCalculated(null)
      }
    }
  }, [quantity, serviceConfig, onPriceCalculated])

  const handleQuantityChange = (e) => {
    const value = e.target.value
    if (value === "" || Number.parseInt(value) >= 0) {
      setQuantity(value)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600">Error loading pricing: {error}</p>
        </div>
      </div>
    )
  }

  if (!serviceConfig) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Service not available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">{serviceConfig.service_name}</h3>

      {serviceConfig.description && <p className="text-gray-600 mb-4">{serviceConfig.description}</p>}

      <div className="space-y-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            min={serviceConfig.min_quantity}
            max={serviceConfig.max_quantity}
            placeholder={`Min: ${serviceConfig.min_quantity}, Max: ${serviceConfig.max_quantity}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum: {serviceConfig.min_quantity} | Maximum: {serviceConfig.max_quantity}
          </p>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Price per unit:</span>
            <span className="font-medium">${serviceConfig.price_per_unit}</span>
          </div>

          {quantity && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Quantity:</span>
              <span className="font-medium">{quantity}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-lg font-semibold border-t pt-2">
            <span>Total:</span>
            <span className="text-orange-600">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {quantity &&
          (Number.parseInt(quantity) < serviceConfig.min_quantity ||
            Number.parseInt(quantity) > serviceConfig.max_quantity) && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-yellow-700 text-sm">
                Quantity must be between {serviceConfig.min_quantity} and {serviceConfig.max_quantity}
              </p>
            </div>
          )}
      </div>
    </div>
  )
}

export default ServicePricing
