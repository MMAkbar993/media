"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import EnterDetailsStep from "../components/Checkout/EnterDetailsStep"
import SelectPostsStep from "../components/Checkout/SelectPostsStep"
import TikTokSelectPostsStep from "../components/TikTok/TikTokSelectPostsStep"
import PaymentStep from "../components/Checkout/PaymentStep"

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { packageDetails } = location.state || {}

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    packageTitle: "",
    price: "",
    quantity: 0,
    platform: "",
    serviceType: "",
    quality: "",
    sendPromotions: false,
    selectedPostIds: [], // For likes, views, comments
    profileImage: "", // Profile image URL
  })
  const [generalError, setGeneralError] = useState("")

  useEffect(() => {
    if (!packageDetails) {
      navigate("/") // Redirect if no package details are found
    } else {
      setFormData((prev) => ({
        ...prev,
        packageTitle: packageDetails.packageTitle,
        price: packageDetails.price,
        quantity: packageDetails.quantity,
        platform: packageDetails.platform,
        serviceType: packageDetails.serviceType,
        quality: packageDetails.quality,
      }))
    }
  }, [packageDetails, navigate])

  const handleNext = () => {
    // Logic to determine next step based on serviceType
    if (currentStep === 1) {
      if (formData.serviceType === "followers") {
        // For followers, set targetUrl to profile URL before skipping to payment
        const profileUrl = formData.platform === "tiktok"
          ? (formData.username ? `https://www.tiktok.com/@${formData.username}/` : "")
          : (formData.username ? `https://www.instagram.com/${formData.username}/` : "")
        setFormData((prev) => ({ ...prev, targetUrl: profileUrl }))
        setCurrentStep(3) // Skip SelectPostsStep for followers
      } else {
        setCurrentStep(2)
      }
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep === 3 && formData.serviceType === "followers") {
      setCurrentStep(1) // Go back to EnterDetailsStep from PaymentStep if service is followers
    } else {
      setCurrentStep((prev) => prev - 1)
    }
  }

  if (!packageDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading package details...</p>
      </div>
    )
  }

  return (
    <>
      {currentStep === 1 && (
        <EnterDetailsStep
          packageDetails={packageDetails}
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
          generalError={generalError}
        />
      )}
      {currentStep === 2 && (
        formData.platform === "tiktok" && formData.serviceType !== "followers" ? (
          <TikTokSelectPostsStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        ) : (
          <SelectPostsStep formData={formData} setFormData={setFormData} onNext={handleNext} onBack={handleBack} />
        )
      )}
      {currentStep === 3 && <PaymentStep formData={formData} onBack={handleBack} setGeneralError={setGeneralError} />}
    </>
  )
}

export default Checkout
