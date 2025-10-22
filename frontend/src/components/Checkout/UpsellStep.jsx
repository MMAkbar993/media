import React from "react";

const getUpsellOffer = (formData) => {
  if (formData.serviceType === "likes") {
    return { extra: 100, label: "likes", price: 1 };
  }
  if (formData.serviceType === "followers") {
    return { extra: 50, label: "followers", price: 2 };
  }
  if (formData.serviceType === "views") {
    return { extra: 1000, label: "views", price: 1 };
  }
  // Default fallback
  return null;
};

const UpsellStep = ({ formData, setFormData, onNext, onBack }) => {
  const offer = getUpsellOffer(formData);
  if (!offer) return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto text-center">
      <p>No upsell available for this service.</p>
      <button onClick={onNext} className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600">Continue</button>
    </div>
  );

  const handleAcceptUpsell = () => {
    setFormData(prev => ({
      ...prev,
      quantity: prev.quantity + offer.extra,
      price: (parseFloat(prev.price) + offer.price).toFixed(2),
      upsellAccepted: true,
    }));
    onNext();
  };

  const handleDeclineUpsell = () => {
    setFormData(prev => ({
      ...prev,
      upsellAccepted: false,
    }));
    onNext();
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold mb-4">Special Offer!</h2>
      <p className="mb-6">Add <span className="font-semibold">{offer.extra} more {offer.label}</span> for just <span className="text-pink-600 font-bold">${offer.price}</span>?</p>
      <div className="flex justify-center gap-4">
        <button onClick={handleAcceptUpsell} className="bg-pink-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-pink-600">Yes, add {offer.extra} {offer.label}</button>
        <button onClick={handleDeclineUpsell} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300">No, thanks</button>
      </div>
      <button onClick={onBack} className="block mt-6 text-gray-500 hover:underline">Back</button>
    </div>
  );
};

export default UpsellStep; 