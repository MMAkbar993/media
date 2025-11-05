import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import apiService from "../../services/api";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51SM4GUK9RxFN96kYXkQUbGRFHK2pZzAgs3CmzjMae6BVstTkzpZNpFgqmjyyjiCPrnNGV8nRML8SPKrnVXe9xa9B00Vx6cpER5"); // Replace with your Stripe public key

const ReviewPayForm = ({ formData, onPaymentSuccess, onPaymentError, totalPrice }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [cardholderName, setCardholderName] = useState("");

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

    // Create PaymentIntent on backend
    let clientSecret;
    try {
      const resp = await apiService.request("/api/payment/create-intent", {
        method: "POST",
        body: JSON.stringify({ amount: Math.round(totalPrice * 100) }),
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
        billing_details: { 
          email: formData.email,
          name: cardholderName 
        },
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
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Review & Pay</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Method Selection */}
            <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment method</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={true}
                readOnly
                className="w-4 h-4 text-orange-500 border-gray-300 focus:ring-orange-500"
              />
              <span className="ml-3 text-gray-900 font-medium">Card</span>
            </div>
            
            <div className="ml-7 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder name</label>
                  <input
                    type="text"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter cardholder name"
                    required
                  />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Card details</label>
                  <div className={`px-3 py-2 border ${errorMsg ? 'border-red-300' : 'border-gray-300'} rounded-md bg-white shadow-sm`}>
            <CardElement options={cardElementOptions} />
          </div>
          {errorMsg && <p className="mt-2 text-sm text-red-600">{errorMsg}</p>}
          <div className="mt-3 flex items-center gap-3 text-gray-400">
                    <div className="w-6 h-4 bg-blue-600 rounded text-white text-xs flex items-center justify-center">V</div>
                    <div className="w-6 h-4 bg-red-500 rounded text-white text-xs flex items-center justify-center">M</div>
                    <div className="w-6 h-4 bg-blue-500 rounded text-white text-xs flex items-center justify-center">A</div>
                    <div className="w-6 h-4 bg-orange-500 rounded text-white text-xs flex items-center justify-center">D</div>
            <span className="ml-auto text-xs">256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'
          }`}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          {loading ? 'Processing...' : `Pay $${totalPrice.toFixed(2)}`}
        </button>

        <p className="text-sm text-gray-500 text-center">
          By clicking Pay, you agree to the <span className="underline">Terms of Service</span> and <span className="underline">Privacy Policy</span>.
        </p>
      </form>
      </div>
  );
};

const PaymentStep = ({ formData, onBack, setGeneralError }) => {
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState(null);
  const [profileImage, setProfileImage] = useState(formData.profileImage || "");
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [totalPrice, setTotalPrice] = useState(parseFloat(formData.price) || 0);

  // Exclusive offers data
  // const exclusiveOffers = [
  //   { id: 1, label: "25 likes x 2 posts", price: 1.49, originalPrice: 1.99, discount: "25% OFF", color: "pink" },
  //   { id: 2, label: "50 likes x 2 posts", price: 2.61, originalPrice: 3.49, discount: "25% OFF", color: "pink" },
  //   { id: 3, label: "100 followers", price: 2.61, originalPrice: 3.49, discount: "25% OFF", color: "pink" },
  //   { id: 4, label: "Profile Analysis", price: 4.99, originalPrice: 9.98, discount: "50% OFF", color: "pink" }
  // ];

  // Handle adding offers to order
  const handleAddOffer = (offer) => {
    const isAlreadyAdded = selectedOffers.some(selected => selected.id === offer.id);
    
    if (isAlreadyAdded) {
      // Remove offer if already added
      setSelectedOffers(prev => prev.filter(selected => selected.id !== offer.id));
      setTotalPrice(prev => prev - offer.price);
    } else {
      // Add offer
      setSelectedOffers(prev => [...prev, offer]);
      setTotalPrice(prev => prev + offer.price);
    }
  };

  // Fetch profile image if not available
  useEffect(() => {
    const fetchProfileImage = async () => {
      console.log("PaymentStep - Profile image check:", {
        profileImage,
        formDataProfileImage: formData.profileImage,
        username: formData.username,
        platform: formData.platform
      });
      
      if (!profileImage && formData.username && formData.platform) {
        try {
          const cleanUsername = formData.username.replace("@", "").toLowerCase();
          console.log("Fetching profile for:", cleanUsername);
          const profileData = await apiService.fetchUserProfile(cleanUsername, formData.platform);
          console.log("Profile data received:", profileData);
          if (profileData?.profile_pic_url) {
            setProfileImage(profileData.profile_pic_url);
            console.log("Profile image set:", profileData.profile_pic_url);
          }
        } catch (error) {
          console.error("Failed to fetch profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [profileImage, formData.username, formData.platform]);

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

      // Validate minimum quantity per post (Five API requires minimum 100 per post)
      const numPosts = formData.selectedPostIds?.length || 1;
      const totalQuantity = Number.parseInt(formData.quantity);
      const quantityPerPost = Math.floor(totalQuantity / numPosts);
      const MIN_QUANTITY_PER_POST = 100;
      
      // Only validate for likes, views, and comments (services that can be split across posts)
      const servicesRequiringMin = ["likes", "views", "comments"];
      if (numPosts > 1 && servicesRequiringMin.includes(formData.serviceType?.toLowerCase()) && quantityPerPost < MIN_QUANTITY_PER_POST) {
        const minTotalQuantity = numPosts * MIN_QUANTITY_PER_POST;
        setGeneralError(
          `Each post must receive at least ${MIN_QUANTITY_PER_POST} ${formData.serviceType}. ` +
          `With ${numPosts} post(s) selected, you need a minimum total of ${minTotalQuantity} ${formData.serviceType}. ` +
          `Currently: ${quantityPerPost} per post (${totalQuantity} total). Please go back and increase your quantity.`
        );
        return;
      }

      // Create order after successful payment
      const orderPayload = {
        platform: formData.platform,
        serviceType: formData.serviceType,
        targetUrl: formData.targetUrl,
        quantity: totalQuantity,
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
    <div className="min-h-screen bg-white">
      {/* Progress Indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
              <span className="ml-2 text-gray-500 font-medium">Details</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
              <span className="ml-2 text-gray-500 font-medium">Posts</span>
            </div>
            <div className="flex-1 h-0.5 bg-orange-500"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
              <span className="ml-2 text-orange-500 font-medium">Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Review & Pay Form */}
        <div className="lg:col-span-2">
          <Elements stripe={stripePromise}>
            <ReviewPayForm formData={formData} onPaymentSuccess={handleSuccess} onPaymentError={handleError} totalPrice={totalPrice} />
          </Elements>
        </div>

        {/* Right: Order Summary & Exclusive Offers */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Header */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  {profileImage ? (
                    <img
                      src={`/api/instagram/image-proxy?url=${encodeURIComponent(profileImage)}`}
                      alt={formData.username || "profile"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-red-500 flex items-center justify-center ${profileImage ? 'hidden' : 'flex'}`}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">@{formData.username || "travisscott"}</p>
                </div>
              </div>
              <button className="text-sm text-blue-600 hover:underline">Change</button>
            </div>

            {/* Order Summary */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Order summary</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-900">{formData.quantity} {formData.serviceType}</p>
                    <p className="text-sm text-gray-500">
                      {Math.floor(formData.quantity / (formData.selectedPostIds?.length || 1))} {formData.serviceType} / {formData.selectedPostIds?.length || 0} posts
                    </p>
                    {formData.selectedPostIds?.length > 1 && (
                      <p className={`text-xs mt-1 ${
                        Math.floor(formData.quantity / formData.selectedPostIds.length) < 100 
                          ? "text-red-600 font-semibold" 
                          : "text-gray-400"
                      }`}>
                        {Math.floor(formData.quantity / formData.selectedPostIds.length) < 100 
                          ? "⚠️ Minimum 100 per post required"
                          : "✓ Meets minimum requirement"}
                      </p>
                    )}
                  </div>
                  <span className="font-semibold text-gray-900">${formData.price}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">I have a coupon code</span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="w-10 h-6 bg-gray-300 rounded-full transition-colors"></div>
                    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform"></div>
                  </div>
                </div>
                
                {/* Selected Offers */}
                {selectedOffers.length > 0 && (
                  <div className="pt-4 border-t">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Added Offers:</h5>
                    {selectedOffers.map((offer) => (
                      <div key={offer.id} className="flex justify-between items-center text-sm mb-1">
                        <span className="text-gray-600">{offer.label}</span>
                        <span className="font-medium">+${offer.price}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold text-gray-900">Total to pay</span>
                  <div className="flex items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mr-2">USD</span>
                    <span className="text-lg font-semibold text-gray-900">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Offers */}
          {/* <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">EXCLUSIVE OFFERS</h4>
            <div className="space-y-4">
              {exclusiveOffers.map((offer) => {
                const isSelected = selectedOffers.some(selected => selected.id === offer.id);
                const colorClasses = {
                  green: "border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50",
                  pink: "border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50", 
                  purple: "border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50"
                };
                const textColorClasses = {
                  green: "text-pink-600",
                  pink: "text-pink-600",
                  purple: "text-pink-600"
                };
                const buttonColorClasses = {
                  green: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
                  pink: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600",
                  purple: "bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                };
                
                return (
                  <div key={offer.id} className={`border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow ${colorClasses[offer.color]}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {offer.discount}
                      </span>
                      <button 
                        onClick={() => handleAddOffer(offer)}
                        className={`${isSelected ? 'bg-gray-600' : buttonColorClasses[offer.color]} text-white px-3 py-1 rounded text-sm flex items-center transition-colors`}
                      >
                        {isSelected ? (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Remove
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{offer.label}</p>
                    <div className="flex items-center">
                      <span className={`${textColorClasses[offer.color]} font-semibold`}>For only ${offer.price}</span>
                      <span className="text-gray-400 line-through ml-2">${offer.originalPrice}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div> */}

          {/* Security & Guarantee */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">Safe & Secure Payment</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">30$</div>
                <span className="text-sm text-gray-700">30 Day Money Back Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStep;