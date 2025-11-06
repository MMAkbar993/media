import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import apiService from "../services/api"
import {
  Package,
  Users,
  Search,
  Filter,
  RefreshCw,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
  DollarSign,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Calendar,
  ExternalLink,
  LogOut,
  Key,
  Lock,
  Settings,
  Save,
} from "lucide-react"

const AdminPanel = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("orders") // 'orders', 'clients', or 'services'
  const [orders, setOrders] = useState([])
  const [clients, setClients] = useState([])
  const [services, setServices] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    platform: "",
    serviceType: "",
    search: "",
    page: 1,
    limit: 20,
  })

  const [clientFilters, setClientFilters] = useState({
    search: "",
    page: 1,
    limit: 20,
  })

  // Selected order for status update
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [statusUpdate, setStatusUpdate] = useState({
    status: "",
    message: "",
    deliveredQuantity: "",
    completionPercentage: "",
  })

  // Pagination
  const [ordersPagination, setOrdersPagination] = useState(null)
  const [clientsPagination, setClientsPagination] = useState(null)

  // Password change modal
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)

  // Service configuration modal
  const [selectedService, setSelectedService] = useState(null)
  const [serviceEditForm, setServiceEditForm] = useState({
    five_api_service_id: "",
    five_api_service_id_backup: "",
  })
  const [savingService, setSavingService] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    const token = apiService.getAdminToken()
    if (!token) {
      navigate("/admin/login")
      return
    }
    fetchDashboardStats()
  }, [navigate])

  // Handle logout
  const handleLogout = async () => {
    try {
      await apiService.adminLogout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("adminToken")
      navigate("/admin/login")
    }
  }

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("All fields are required")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long")
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setChangingPassword(true)

    try {
      const response = await apiService.changeAdminPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword
      )

      if (response.success) {
        setPasswordSuccess(true)
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setTimeout(() => {
          setShowChangePasswordModal(false)
          setPasswordSuccess(false)
        }, 2000)
      } else {
        setPasswordError(response.error || "Failed to change password")
      }
    } catch (error) {
      console.error("Password change error:", error)
      setPasswordError(error.message || "Failed to change password")
    } finally {
      setChangingPassword(false)
    }
  }

  // Fetch dashboard stats
  const fetchDashboardStats = async () => {
    try {
      const response = await apiService.getAdminDashboardStats()
      if (response.success) {
        setDashboardStats(response.stats)
      }
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error)
      // If unauthorized, redirect to login
      if (error.message && error.message.includes("401")) {
        navigate("/admin/login")
      }
    }
  }

  // Fetch orders when filters change
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders()
    }
  }, [activeTab, filters])

  // Fetch clients when filters change
  useEffect(() => {
    if (activeTab === "clients") {
      fetchClients()
    }
  }, [activeTab, clientFilters])

  // Fetch services when tab changes
  useEffect(() => {
    if (activeTab === "services") {
      fetchServices()
    }
  }, [activeTab])

  const fetchOrders = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiService.getAdminOrders(filters)
      if (response.success) {
        setOrders(response.orders)
        setOrdersPagination(response.pagination)
      } else {
        setError("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error.message || "Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiService.getAdminClients(clientFilters)
      if (response.success) {
        setClients(response.clients)
        setClientsPagination(response.pagination)
      } else {
        setError("Failed to fetch clients")
      }
    } catch (error) {
      console.error("Error fetching clients:", error)
      setError(error.message || "Failed to fetch clients")
    } finally {
      setLoading(false)
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    setError("")
    try {
      const response = await apiService.getAdminServices()
      console.log("Services API response:", response)
      if (response.success) {
        console.log(`Setting ${response.services?.length || 0} services`)
        setServices(response.services || [])
        if (!response.services || response.services.length === 0) {
          setError("No services found in database. Please run the seed file to populate service configurations.")
        }
      } else {
        setError(response.error || "Failed to fetch services")
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setError(error.message || "Failed to fetch services")
    } finally {
      setLoading(false)
    }
  }

  const openServiceEditModal = (service) => {
    setSelectedService(service)
    setServiceEditForm({
      five_api_service_id: service.five_api_service_id || "",
      five_api_service_id_backup: service.five_api_service_id_backup || "",
    })
  }

  const handleServiceUpdate = async () => {
    if (!selectedService) return

    setSavingService(true)
    setError("")

    try {
      const response = await apiService.updateAdminService(selectedService.id, {
        five_api_service_id: serviceEditForm.five_api_service_id,
        five_api_service_id_backup: serviceEditForm.five_api_service_id_backup || null,
      })

      if (response.success) {
        alert("Service ID updated successfully!")
        setSelectedService(null)
        setServiceEditForm({
          five_api_service_id: "",
          five_api_service_id_backup: "",
        })
        fetchServices() // Refresh the list
      } else {
        setError(response.error || "Failed to update service ID")
      }
    } catch (error) {
      console.error("Error updating service:", error)
      setError(error.message || "Failed to update service ID")
    } finally {
      setSavingService(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !statusUpdate.status) {
      alert("Please select a status")
      return
    }

    try {
      const updateData = {
        status: statusUpdate.status,
        message: statusUpdate.message || `Status updated to ${statusUpdate.status}`,
      }

      if (statusUpdate.deliveredQuantity) {
        updateData.deliveredQuantity = parseInt(statusUpdate.deliveredQuantity)
      }
      if (statusUpdate.completionPercentage) {
        updateData.completionPercentage = parseFloat(statusUpdate.completionPercentage)
      }

      const response = await apiService.updateOrderStatus(selectedOrder.id, updateData)
      if (response.success) {
        alert("Order status updated successfully!")
        setSelectedOrder(null)
        setStatusUpdate({
          status: "",
          message: "",
          deliveredQuantity: "",
          completionPercentage: "",
        })
        fetchOrders()
        fetchDashboardStats()
      } else {
        alert("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert(error.message || "Failed to update order status")
    }
  }

  const openStatusModal = (order) => {
    setSelectedOrder(order)
    setStatusUpdate({
      status: order.status || "",
      message: "",
      deliveredQuantity: order.delivered_quantity?.toString() || "",
      completionPercentage: order.completion_percentage?.toString() || "",
    })
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending_payment: "bg-yellow-100 text-yellow-800 border-yellow-300",
      payment_confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      processing: "bg-purple-100 text-purple-800 border-purple-300",
      in_progress: "bg-orange-100 text-orange-800 border-orange-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      partial: "bg-indigo-100 text-indigo-800 border-indigo-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      refunded: "bg-gray-100 text-gray-800 border-gray-300",
      failed: "bg-red-100 text-red-800 border-red-300",
    }

    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800 border-gray-300"

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${colorClass}`}
      >
        {status.replace(/_/g, " ").toUpperCase()}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage orders and clients</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              <Key className="w-4 h-4 mr-2" />
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.totalOrders}</p>
                </div>
                <Package className="w-12 h-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.pendingOrders}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Completed Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardStats.completedOrders}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${dashboardStats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-12 h-12 text-green-500" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "orders"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Orders
              </button>
              <button
                onClick={() => setActiveTab("clients")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "clients"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Clients
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "services"
                    ? "border-orange-500 text-orange-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Services
              </button>
            </nav>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-center">
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Order #, Email, URL..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_confirmed">Payment Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="partial">Partial</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <select
                    value={filters.platform}
                    onChange={(e) => setFilters({ ...filters, platform: e.target.value, page: 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Platforms</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={filters.serviceType}
                    onChange={(e) => setFilters({ ...filters, serviceType: e.target.value, page: 1 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">All Services</option>
                    <option value="likes">Likes</option>
                    <option value="followers">Followers</option>
                    <option value="views">Views</option>
                    <option value="comments">Comments</option>
                  </select>
                </div>
              </div>

              <button
                onClick={fetchOrders}
                disabled={loading}
                className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                  <p className="text-gray-600">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No orders found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.order_number}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.email || "N/A"}</div>
                          {(order.first_name || order.last_name) && (
                            <div className="text-xs text-gray-500">
                              {order.first_name} {order.last_name}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.platform} {order.service_type}
                          </div>
                          <a
                            href={order.target_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-orange-500 hover:text-orange-600 flex items-center"
                          >
                            View URL <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.quantity?.toLocaleString()}</div>
                          {order.delivered_quantity > 0 && (
                            <div className="text-xs text-gray-500">
                              Delivered: {order.delivered_quantity?.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${parseFloat(order.amount || 0).toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(order.status)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(order.created_at)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openStatusModal(order)}
                            className="text-orange-600 hover:text-orange-900 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {ordersPagination && ordersPagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((ordersPagination.page - 1) * ordersPagination.limit) + 1} to{" "}
                  {Math.min(ordersPagination.page * ordersPagination.limit, ordersPagination.total)} of{" "}
                  {ordersPagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {ordersPagination.page} of {ordersPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={filters.page >= ordersPagination.totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clients Tab */}
        {activeTab === "clients" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Clients</label>
                  <div className="relative">
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Email, Name..."
                      value={clientFilters.search}
                      onChange={(e) => setClientFilters({ ...clientFilters, search: e.target.value, page: 1 })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  onClick={fetchClients}
                  disabled={loading}
                  className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Clients Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                  <p className="text-gray-600">Loading clients...</p>
                </div>
              ) : clients.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No clients found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Orders
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Completed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Spent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Order
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                              <User className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {client.first_name && client.last_name
                                  ? `${client.first_name} ${client.last_name}`
                                  : "N/A"}
                              </div>
                              <div className="text-sm text-gray-500">{client.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            {client.email}
                          </div>
                          {client.phone && (
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              {client.phone}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{client.total_orders}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{client.completed_orders}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${client.total_spent.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {formatDate(client.last_order_date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              client.user_status === "active"
                                ? "bg-green-100 text-green-800"
                                : client.user_status === "suspended"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {client.user_status || "active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {clientsPagination && clientsPagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((clientsPagination.page - 1) * clientsPagination.limit) + 1} to{" "}
                  {Math.min(clientsPagination.page * clientsPagination.limit, clientsPagination.total)} of{" "}
                  {clientsPagination.total} results
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setClientFilters({ ...clientFilters, page: clientFilters.page - 1 })}
                    disabled={clientFilters.page === 1 || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {clientsPagination.page} of {clientsPagination.totalPages}
                  </span>
                  <button
                    onClick={() => setClientFilters({ ...clientFilters, page: clientFilters.page + 1 })}
                    disabled={clientFilters.page >= clientsPagination.totalPages || loading}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Service Configurations</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Manage Five API service IDs for each platform and service type
                </p>
              </div>
              <button
                onClick={fetchServices}
                disabled={loading}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-400 flex items-center"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-orange-500 mb-4" />
                  <p className="text-gray-600">Loading services...</p>
                </div>
              ) : services.length === 0 ? (
                <div className="p-12 text-center">
                  <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">No services found</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Five API Service ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Backup Service ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                            {service.platform}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900 capitalize">
                            {service.service_type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{service.service_name}</div>
                          {service.description && (
                            <div className="text-xs text-gray-500 mt-1">{service.description}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono font-semibold text-gray-900">
                            {service.five_api_service_id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-600">
                            {service.five_api_service_id_backup || (
                              <span className="text-gray-400 italic">None</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              service.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {service.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openServiceEditModal(service)}
                            className="text-orange-600 hover:text-orange-900 flex items-center"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit Service ID
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Order Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Order Number</label>
                  <input
                    type="text"
                    value={selectedOrder.order_number}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                  <select
                    value={statusUpdate.status}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Select Status</option>
                    <option value="pending_payment">Pending Payment</option>
                    <option value="payment_confirmed">Payment Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="partial">Partial</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivered Quantity
                  </label>
                  <input
                    type="number"
                    value={statusUpdate.deliveredQuantity}
                    onChange={(e) =>
                      setStatusUpdate({ ...statusUpdate, deliveredQuantity: e.target.value })
                    }
                    placeholder="Enter delivered quantity"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Completion Percentage
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={statusUpdate.completionPercentage}
                    onChange={(e) =>
                      setStatusUpdate({ ...statusUpdate, completionPercentage: e.target.value })
                    }
                    placeholder="Enter completion %"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    value={statusUpdate.message}
                    onChange={(e) => setStatusUpdate({ ...statusUpdate, message: e.target.value })}
                    placeholder="Optional message for status update"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleStatusUpdate}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                  >
                    Update Status
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null)
                      setStatusUpdate({
                        status: "",
                        message: "",
                        deliveredQuantity: "",
                        completionPercentage: "",
                      })
                    }}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
                <button
                  onClick={() => {
                    setShowChangePasswordModal(false)
                    setPasswordForm({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    })
                    setPasswordError("")
                    setPasswordSuccess(false)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{passwordError}</p>
                </div>
              )}

              {passwordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">Password changed successfully!</p>
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                    }
                    placeholder="Enter current password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={changingPassword}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                    }
                    placeholder="Enter new password (min 6 characters)"
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={changingPassword}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                    }
                    placeholder="Confirm new password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={changingPassword}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {changingPassword ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePasswordModal(false)
                      setPasswordForm({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      })
                      setPasswordError("")
                      setPasswordSuccess(false)
                    }}
                    disabled={changingPassword}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Service Edit Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Edit Service Configuration</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service
                  </label>
                  <input
                    type="text"
                    value={`${selectedService.platform} - ${selectedService.service_type}`}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Five API Service ID *
                  </label>
                  <input
                    type="text"
                    value={serviceEditForm.five_api_service_id}
                    onChange={(e) =>
                      setServiceEditForm({
                        ...serviceEditForm,
                        five_api_service_id: e.target.value,
                      })
                    }
                    placeholder="Enter service ID (e.g., 7504)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This is the primary service ID used when submitting orders to Five API
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Service ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={serviceEditForm.five_api_service_id_backup}
                    onChange={(e) =>
                      setServiceEditForm({
                        ...serviceEditForm,
                        five_api_service_id_backup: e.target.value,
                      })
                    }
                    placeholder="Enter backup service ID (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optional backup service ID used if primary fails
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleServiceUpdate}
                    disabled={savingService || !serviceEditForm.five_api_service_id}
                    className="flex-1 bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {savingService ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedService(null)
                      setServiceEditForm({
                        five_api_service_id: "",
                        five_api_service_id_backup: "",
                      })
                      setError("")
                    }}
                    disabled={savingService}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel

