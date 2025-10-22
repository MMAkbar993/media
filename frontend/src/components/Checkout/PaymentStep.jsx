import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import apiService from "../../services/api";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_qblFNYngBkEdjEZ16jxxoWSM"); // Replace with your Stripe public key

const StripeForm = ({ formData, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const cardElementOptions = {
    style: {
      base: {
        color: "#1f2937",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        '::placeholder': { color: "#9ca3af" },
        iconColor: "#9ca3af",
      },
      invalid: {
        color: "#ef4444",
        iconColor: "#ef4444",
      },
    },
    hidePostalCode: true,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!stripe || !elements) return;

    // Create PaymentIntent on backend (via ApiService to ensure correct base URL)
    let clientSecret;
    try {
      const resp = await apiService.request("/api/payment/create-intent", {
        method: "POST",
        body: JSON.stringify({ amount: Math.round(formData.price * 100) }),
      });
      clientSecret = resp.clientSecret;
    } catch (err) {
      const msg = err.message || "Failed to create payment intent";
      setErrorMsg(msg);
      onPaymentError(msg);
      setLoading(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { email: formData.email },
      },
    });

    setLoading(false);
    if (result.error) {
      setErrorMsg(result.error.message);
      onPaymentError(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      onPaymentSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl max-w-2xl mx-auto overflow-hidden">
      {/* Header */}
      <div className="px-6 sm:px-8 py-6 border-b bg-gradient-to-r from-orange-50 to-pink-50">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0-1.657 1.343-3 3-3V6a3 3 0 10-6 0v2a3 3 0 013 3zm-7 4a7 7 0 1114 0v2a2 2 0 01-2 2H7a2 2 0 01-2-2v-2z"/></svg>
          <h3 className="text-lg font-semibold text-gray-900">Secure Checkout</h3>
          <span className="ml-auto text-sm text-gray-500">Powered by Stripe</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 sm:px-8 py-6 grid gap-6">
        {/* Order Summary */}
        <div className="rounded-xl border bg-white">
          <div className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Amount to pay</p>
              <p className="text-2xl font-bold text-gray-900">${formData.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Service</p>
              <p className="text-sm font-medium text-gray-900">{formData.quantity} {formData.serviceType} · {formData.platform}</p>
            </div>
          </div>
        </div>

        {/* Card Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card details</label>
          <div className={`px-3 py-3 rounded-xl border ${errorMsg ? 'border-red-300' : 'border-gray-300'} bg-white shadow-sm`}> 
            <CardElement options={cardElementOptions} />
          </div>
          {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
          <div className="mt-3 flex items-center gap-3 text-gray-400">
            {/* Accepted cards (icons as simple svgs) */}
            <svg className="h-6" viewBox="0 0 48 32" fill="#1a1f71"><rect rx="4" width="48" height="32" fill="#f3f4f6"/></svg>
            <svg className="h-6" viewBox="0 0 48 32" fill="#ff5f00"><rect rx="4" width="48" height="32" fill="#f3f4f6"/></svg>
            <svg className="h-6" viewBox="0 0 48 32" fill="#006fcf"><rect rx="4" width="48" height="32" fill="#f3f4f6"/></svg>
            <span className="ml-auto text-xs">256-bit SSL encryption</span>
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full inline-flex justify-center items-center px-6 py-3 rounded-xl font-semibold text-white shadow-sm transition-colors ${(!stripe || loading) ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600'}`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
              Processing...
            </>
          ) : (
            <>Pay ${formData.price} with Card</>
          )}
        </button>

        <p className="text-xs text-gray-500 text-center">By confirming your payment, you agree to our Terms and Privacy Policy.</p>
      </div>
    </form>
  );
};

const PaymentStep = ({ formData, onBack, setGeneralError }) => {
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState(null);

  const handleSuccess = async () => {
    try {
      // Validate required fields from formData before creating order
      const required = ["platform", "serviceType", "targetUrl", "quantity", "email"];
      const missing = required.filter((k) => {
        if (k === "quantity") return !formData[k] || Number.parseInt(formData[k]) <= 0;
        return !formData[k];
      });
      if (missing.length) {
        setGeneralError(`Missing required fields: ${missing.join(", ")}`);
        return;
      }

      // Create order after successful payment
      const orderPayload = {
        platform: formData.platform,
        serviceType: formData.serviceType,
        targetUrl: formData.targetUrl,
        quantity: Number.parseInt(formData.quantity),
        email: formData.email,
      };

      const order = await apiService.createOrder(orderPayload);

      if (order?.orderNumber) {
        setToast({ visible: true, message: `Order placed successfully. Order No: ${order.orderNumber}` });
        setTimeout(() => setToast({ visible: false, message: "" }), 5000);
        // Store order number for display; do not auto-redirect
        setOrderNumber(order.orderNumber);
      }

      setSuccess(true);
    } catch (err) {
      setGeneralError(err.message || "Payment succeeded but order creation failed");
    }
  };

  const handleError = (msg) => setGeneralError(msg);

  if (success) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto text-center relative">
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
        <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
        <p className="mb-2">Your order is being processed.</p>
        <p className="mb-4">You will receive a confirmation email shortly with order number{orderNumber ? ` ${orderNumber}` : ""}.</p>
        {orderNumber && (
          <button
            type="button"
            className="mt-2 inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            onClick={() => navigate(`/track/${encodeURIComponent(orderNumber)}`)}
          >
            Track this order
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Payment */}
        <div className="lg:col-span-2">
          <Elements stripe={stripePromise}>
            <StripeForm formData={formData} onPaymentSuccess={handleSuccess} onPaymentError={handleError} />
          </Elements>
          <button onClick={onBack} className="mt-6 text-gray-600 hover:text-gray-800 inline-flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
        </div>
        {/* Right: Order recap */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">Platform</span><span className="font-medium">{formData.platform}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Service</span><span className="font-medium capitalize">{formData.serviceType}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Quantity</span><span className="font-medium">{formData.quantity}</span></div>
              <div className="flex justify-between"><span className="text-gray-600">Target</span><span className="font-medium truncate max-w-[160px]" title={formData.targetUrl}>{formData.targetUrl}</span></div>
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-gray-600">Total</span>
              <span className="text-2xl font-bold text-gray-900">${formData.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;