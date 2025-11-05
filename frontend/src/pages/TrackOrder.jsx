import { useState, useEffect } from "react"
import { useNavigate, useParams } from 'react-router-dom';
import apiService from "../services/api";
import { 
  Clock, 
  CreditCard, 
  Settings, 
  Play, 
  CheckCircle, 
  Package, 
  RefreshCw,
  User,
  Mail,
  Hash,
  Shield,
  Phone,
  MessageCircle
} from 'lucide-react';

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orderNumber: orderNumberParam } = useParams();

  const [orderData, setOrderData] = useState(null)
  const [trackingForm, setTrackingForm] = useState({
    orderNumber: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const navigates = (path) => {
    console.log(`Navigating to: ${path}`)
    navigate(path);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setTrackingForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleTrackOrder = async (orderNumberOverride) => {
    const orderNo = orderNumberOverride || trackingForm.orderNumber;
    if (!orderNo) {
      setError("Please enter your order number")
      return
    }

    try {
      setIsLoading(true)
      setError("")

      const result = await apiService.getOrder(orderNo)
      if (result?.success && result.order) {
        setOrderData(result.order)
        setError("")
      } else if (result?.order_number || result?.id) {
        // In case backend returns order directly
        setOrderData(result)
      } else {
        setError("Order not found")
        setOrderData(null)
      }
    } catch (error) {
      console.error("Error tracking order:", error)
      setError(error.message || "Failed to track order. Please try again.")
      setOrderData(null)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-fetch when order number param exists
  useEffect(() => {
    if (orderNumberParam) {
      setTrackingForm({ orderNumber: orderNumberParam })
      handleTrackOrder(orderNumberParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumberParam])

  // Enhanced progress stages with icons and descriptions
  const getOrderStages = (status, completionPercentage) => {
    const stages = [
      {
        id: 'pending_payment',
        icon: Clock,
        title: 'Payment Pending',
        description: 'Waiting for payment confirmation',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        borderColor: 'border-yellow-300'
      },
      {
        id: 'payment_confirmed',
        icon: CreditCard,
        title: 'Payment Confirmed',
        description: 'Payment received successfully',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        borderColor: 'border-blue-300'
      },
      {
        id: 'processing',
        icon: Settings,
        title: 'Order Processing',
        description: 'Preparing your order',
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        borderColor: 'border-purple-300'
      },
      {
        id: 'in_progress',
        icon: Play,
        title: 'In Progress',
        description: 'Your order is being fulfilled',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-300'
      },
      {
        id: 'completed',
        icon: CheckCircle,
        title: 'Completed',
        description: 'Order successfully delivered',
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300'
      }
    ]

    const statusOrder = ['pending_payment', 'payment_confirmed', 'processing', 'in_progress', 'completed']
    const currentIndex = statusOrder.indexOf(status)
    
    return stages.map((stage, index) => ({
      ...stage,
      isCompleted: index < currentIndex,
      isCurrent: index === currentIndex,
      isUpcoming: index > currentIndex,
      progress: index === currentIndex ? (completionPercentage || 0) : (index < currentIndex ? 100 : 0)
    }))
  }

  const formatTimeElapsed = (createdAt) => {
    if (!createdAt) return "Unknown"
    
    const now = new Date()
    const created = new Date(createdAt)
    const diffMs = now - created
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours}h ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`
    } else {
      return `${diffMinutes}m ago`
    }
  }

  const ModernOrderTracker = ({ order }) => {
    const stages = getOrderStages(order.status, order.completion_percentage)
    const currentStage = stages.find(s => s.isCurrent)
    const completedStages = stages.filter(s => s.isCompleted).length
    const totalStages = stages.length

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Order #{order.order_number}</h2>
              <p className="text-orange-100 mb-1">
                {order.quantity?.toLocaleString()} {order.platform} {order.service_type}
              </p>
              <p className="text-orange-200 text-sm">
                Ordered {formatTimeElapsed(order.created_at)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${order.amount}</div>
              <div className="text-orange-200 text-sm">
                {currentTime.toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>

        {/* Current Status Banner */}
        {currentStage && (
          <div className={`${currentStage.bgColor} ${currentStage.borderColor} border-l-4 p-4`}>
            <div className="flex items-center">
              <currentStage.icon className={`w-6 h-6 ${currentStage.color} mr-3`} />
              <div>
                <h3 className={`font-semibold ${currentStage.color}`}>{currentStage.title}</h3>
                <p className="text-gray-600 text-sm">{currentStage.description}</p>
              </div>
              {order.status === 'in_progress' && (
                <div className="ml-auto">
                  <RefreshCw className="w-5 h-5 text-orange-500 animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Progress Timeline */}
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Progress</h3>
            <span className="text-sm text-gray-500">
              Step {completedStages + 1} of {totalStages}
            </span>
          </div>

          <div className="space-y-6">
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <div key={stage.id} className="flex items-center">
                  {/* Icon Container */}
                  <div className="flex-shrink-0 relative">
                    <div
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        stage.isCompleted
                          ? 'bg-green-500 border-green-500 text-white'
                          : stage.isCurrent
                          ? `${stage.bgColor} ${stage.borderColor} ${stage.color} ring-4 ring-opacity-20 ${stage.bgColor.replace('bg-', 'ring-')}`
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                      }`}
                    >
                      {stage.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>
                    
                    {/* Connecting Line */}
                    {index < stages.length - 1 && (
                      <div
                        className={`absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-6 transition-colors duration-500 ${
                          stage.isCompleted ? 'bg-green-500' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-6 flex-1">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`font-medium ${
                          stage.isCompleted
                            ? 'text-green-600'
                            : stage.isCurrent
                            ? stage.color
                            : 'text-gray-400'
                        }`}
                      >
                        {stage.title}
                      </h4>
                      {stage.isCurrent && stage.progress > 0 && (
                        <span className={`text-sm ${stage.color} font-medium`}>
                          {stage.progress}%
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-sm ${
                        stage.isCompleted || stage.isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}
                    >
                      {stage.description}
                    </p>
                    
                    {/* Progress Bar for Current Stage */}
                    {stage.isCurrent && stage.progress > 0 && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${stage.bgColor.replace('100', '500')}`}
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="border-t border-gray-100 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Stats */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Delivery Progress
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Start Count:</span>
                  <span className="font-medium text-green-900">
                    {order.start_count?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Delivered:</span>
                  <span className="font-medium text-green-900">
                    {order.delivered_quantity?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">End Count:</span>
                  <span className="font-medium text-green-900">
                    {order.end_count?.toLocaleString() || order.start_count?.toLocaleString() || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Total Ordered:</span>
                  <span className="font-medium text-green-900">
                    {order.quantity?.toLocaleString() || 0}
                  </span>
                </div>
                {order.quantity > 0 && (
                  <div className="w-full bg-green-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((order.delivered_quantity / order.quantity) * 100, 100)}%` }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Target URL */}
            {order.target_url && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Target URL</h4>
                <a
                  href={order.target_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:text-orange-600 text-sm break-all underline"
                >
                  {order.target_url}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-gray-50 px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigates("/instagram")}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 px-6 rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all duration-300 font-semibold transform hover:scale-105"
            >
              Place New Order
            </button>
            <button
              onClick={() => {
                setOrderData(null)
                setTrackingForm({ orderNumber: "" })
              }}
              className="flex-1 bg-white text-gray-700 py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-semibold"
            >
              Track Another Order
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Your Order</h1>
            <p className="text-xl text-gray-600">Real-time order tracking and updates</p>
          </div>

          {/* Secure Tracking Form */}
          {!orderData && (
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Package className="w-8 h-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Order Details</h2>
                <p className="text-gray-600">We'll show you real-time updates on your order</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-3">
                    <Hash className="w-4 h-4 mr-2 text-gray-400" />
                    Order Number
                  </label>
                  <input
                    type="text"
                    name="orderNumber"
                    value={trackingForm.orderNumber}
                    onChange={handleInputChange}
                    placeholder="Enter your order number"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    required
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => handleTrackOrder()}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-xl hover:from-orange-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 transition-all duration-300 font-bold text-lg transform hover:scale-105 disabled:transform-none"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Tracking Your Order...
                    </span>
                  ) : (
                    "Track My Order"
                  )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start">
                  <Shield className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Secure & Private</h4>
                    <p className="text-sm text-blue-700">
                      Enter your order number to securely view your order status.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-medium text-red-900">Order Not Found</h3>
                  <p className="text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Modern Order Tracker */}
          {orderData && (
            <div className="mb-8">
              <ModernOrderTracker order={orderData} />
            </div>
          )}

          {/* Help Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-gray-600">
                Our support team is here to help you with any questions about your order.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => navigate("/contact-us")} 
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Support
              </button>
              <button
                onClick={() => navigate("/instagram")}
                className="flex items-center justify-center bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                <Package className="w-5 h-5 mr-2" />
                Place New Order
              </button>
            </div>
          </div>
        </div> 
      </div>
    </div>
  )
}

export default TrackOrder