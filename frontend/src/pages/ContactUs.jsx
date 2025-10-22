import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Shield } from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderId: '',
    username: '',
    message: '',
    purchaseDate: ''
  });
  
  const [validationState, setValidationState] = useState({
    isValidating: false,
    isValid: false,
    isValidated: false,
    error: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  // Mock order validation function - replace with your actual API call
  const validateOrder = async (orderId, email) => {
    setValidationState({ isValidating: true, isValid: false, isValidated: false, error: '' });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation logic - replace with actual API call
      const mockOrders = [
        { id: 'ORD-123456', email: 'john@example.com', date: '2024-01-15' },
        { id: 'ORD-789012', email: 'jane@example.com', date: '2024-01-20' },
        { id: 'ORD-345678', email: 'mike@example.com', date: '2024-01-25' }
      ];
      
      const order = mockOrders.find(o => o.id === orderId && o.email.toLowerCase() === email.toLowerCase());
      
      if (order) {
        setValidationState({
          isValidating: false,
          isValid: true,
          isValidated: true,
          error: ''
        });
        setFormData(prev => ({ ...prev, purchaseDate: order.date }));
      } else {
        setValidationState({
          isValidating: false,
          isValid: false,
          isValidated: true,
          error: 'Invalid order ID or email. Please check your order confirmation.'
        });
      }
    } catch {
      setValidationState({
        isValidating: false,
        isValid: false,
        isValidated: true,
        error: 'Failed to validate order. Please try again.'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset validation when order ID or email changes
    if (name === 'orderId' || name === 'email') {
      setValidationState({
        isValidating: false,
        isValid: false,
        isValidated: false,
        error: ''
      });
    }
  };

  const handleValidateOrder = () => {
    if (!formData.orderId || !formData.email) {
      setValidationState({
        isValidating: false,
        isValid: false,
        isValidated: true,
        error: 'Please enter both Order ID and Email address.'
      });
      return;
    }
    
    validateOrder(formData.orderId, formData.email);
  };

  const handleSubmit = async () => {
    if (!validationState.isValid) {
      return;
    }
    
    if (!formData.name || !formData.message) {
      setSubmitStatus('validation-error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful submission
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          orderId: '',
          username: '',
          message: '',
          purchaseDate: ''
        });
        setValidationState({
          isValidating: false,
          isValid: false,
          isValidated: false,
          error: ''
        });
        setSubmitStatus('');
      }, 3000);
      
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-lg mx-auto">
            At hypeis.us, we pride ourselves on our expert, best-in-the-industry customer care. 
            To ensure we can help you effectively, please validate your order first.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-800 mb-1">Secure Customer Support</h3>
            <p className="text-blue-700 text-sm">
              To protect your privacy and provide personalized support, we require order verification before processing support requests.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="space-y-6">
            {/* Step 1: Order Validation */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                Verify Your Order
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order ID *
                  </label>
                  <input
                    type="text"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder="e.g., ORD-123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={validationState.isValid}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="order@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    disabled={validationState.isValid}
                  />
                </div>
              </div>
              
              {!validationState.isValid && (
                <button
                  type="button"
                  onClick={handleValidateOrder}
                  disabled={validationState.isValidating || !formData.orderId || !formData.email}
                  className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {validationState.isValidating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Validating...
                    </>
                  ) : (
                    'Validate Order'
                  )}
                </button>
              )}
              
              {/* Validation Status */}
              {validationState.isValidated && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  validationState.isValid 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {validationState.isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className={`font-medium ${validationState.isValid ? 'text-green-800' : 'text-red-800'}`}>
                      {validationState.isValid ? 'Order Verified!' : 'Verification Failed'}
                    </p>
                    <p className={`text-sm ${validationState.isValid ? 'text-green-700' : 'text-red-700'}`}>
                      {validationState.isValid 
                        ? 'Your order has been verified. You can now submit your support request.'
                        : validationState.error
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Contact Details (only show if validated) */}
            {validationState.isValid && (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Contact Information
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your Full Name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username/Handle
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        placeholder="@instagram_handle"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Step 3: Message */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <span className="bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Your Message
                  </h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      How can we help you? *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Please describe your issue or question in detail..."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                    />
                  </div>
                </div>

                {/* Validation Error */}
                {submitStatus === 'validation-error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-red-800">Required Fields Missing</p>
                      <p className="text-sm text-red-700">Please fill in your name and message.</p>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.message}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </>
            )}

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-800">Message Sent Successfully!</p>
                  <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-800">Failed to Send Message</p>
                  <p className="text-sm text-red-700">Please try again or contact us directly.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-2">Need to find your Order ID?</h3>
            <p className="text-gray-600 text-sm">
              Check your email confirmation or receipt. Order IDs typically start with "ORD-" followed by numbers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;