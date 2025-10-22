"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import PackageCard from "./PakageCard"

const packagesData = {
  instagram: {
    likes: {
      highQuality: [
        { label: "50 Likes", price: "1.99", originalPrice: "3.99", quantity: 50 },
        { label: "100", discount: "$3 OFF", price: "2.99", originalPrice: "5.99", quantity: 100 },
        { label: "250", discount: "$3 OFF", price: "4.99", originalPrice: "7.99", quantity: 250 },
        { label: "500", discount: "$5 OFF", price: "7.99", originalPrice: "12.99", quantity: 500 },
        {
          label: "1K",
          discount: "$12 OFF",
          highlight: "BEST SELLING",
          price: "14.99",
          originalPrice: "26.99",
          quantity: 1000,
        },
        { label: "2.5K", discount: "$33 OFF", price: "29.99", originalPrice: "62.99", quantity: 2500 },
        { label: "5K", discount: "$80 OFF", price: "49.99", originalPrice: "129.99", quantity: 5000 },
        { label: "10K", discount: "$260 OFF", price: "79.99", originalPrice: "339.99", quantity: 10000 },
        {
          label: "20K",
          discount: "$510 OFF",
          highlight: "BULK PRICE",
          price: "129.99",
          originalPrice: "639.99",
          quantity: 20000,
        },
      ],
      premium: [
        { label: "50 Likes", price: "2.99", originalPrice: "4.99", quantity: 50 },
        { label: "100", discount: "$3 OFF", price: "3.99", originalPrice: "6.99", quantity: 100 },
        { label: "250", discount: "$3 OFF", price: "5.99", originalPrice: "8.99", quantity: 250 },
        { label: "500", discount: "$5 OFF", price: "9.99", originalPrice: "14.99", quantity: 500 },
        {
          label: "1K",
          discount: "$12 OFF",
          highlight: "BEST SELLING",
          price: "17.99",
          originalPrice: "29.99",
          quantity: 1000,
        },
        { label: "2.5K", discount: "$33 OFF", price: "34.99", originalPrice: "67.99", quantity: 2500 },
        { label: "5K", discount: "$80 OFF", price: "59.99", originalPrice: "139.99", quantity: 5000 },
        { label: "10K", discount: "$260 OFF", price: "89.99", originalPrice: "349.99", quantity: 10000 },
        {
          label: "20K",
          discount: "$510 OFF",
          highlight: "BULK PRICE",
          price: "149.99",
          originalPrice: "659.99",
          quantity: 20000,
        },
      ],
    },
    views: {
      highQuality: [
        { label: "500 Views", price: "1.99", originalPrice: "3.99", quantity: 500 },
        { label: "1K", discount: "$3 OFF", price: "2.99", originalPrice: "5.99", quantity: 1000 },
        { label: "2.5K", discount: "$3 OFF", price: "4.99", originalPrice: "7.99", quantity: 2500 },
        { label: "5K", discount: "$5 OFF", price: "7.99", originalPrice: "12.99", quantity: 5000 },
        {
          label: "10K",
          discount: "$12 OFF",
          highlight: "BEST SELLING",
          price: "14.99",
          originalPrice: "26.99",
          quantity: 10000,
        },
        { label: "25K", discount: "$33 OFF", price: "29.99", originalPrice: "62.99", quantity: 25000 },
        { label: "50K", discount: "$80 OFF", price: "49.99", originalPrice: "129.99", quantity: 50000 },
        { label: "100K", discount: "$260 OFF", price: "79.99", originalPrice: "339.99", quantity: 100000 },
        {
          label: "200K",
          discount: "$510 OFF",
          highlight: "BULK PRICE",
          price: "129.99",
          originalPrice: "639.99",
          quantity: 200000,
        },
      ],
      premium: [
        { label: "500 Views", price: "2.99", originalPrice: "4.99", quantity: 500 },
        { label: "1K", discount: "$3 OFF", price: "3.99", originalPrice: "6.99", quantity: 1000 },
        { label: "2.5K", discount: "$3 OFF", price: "5.99", originalPrice: "8.99", quantity: 2500 },
        { label: "5K", discount: "$5 OFF", price: "9.99", originalPrice: "14.99", quantity: 5000 },
        {
          label: "10K",
          discount: "$12 OFF",
          highlight: "BEST SELLING",
          price: "17.99",
          originalPrice: "29.99",
          quantity: 10000,
        },
        { label: "25K", discount: "$33 OFF", price: "34.99", originalPrice: "67.99", quantity: 25000 },
        { label: "50K", discount: "$80 OFF", price: "59.99", originalPrice: "139.99", quantity: 50000 },
        { label: "100K", discount: "$260 OFF", price: "89.99", originalPrice: "349.99", quantity: 100000 },
        {
          label: "200K",
          discount: "$510 OFF",
          highlight: "BULK PRICE",
          price: "149.99",
          originalPrice: "659.99",
          quantity: 200000,
        },
      ],
    },
    comments: {
      highQuality: [
        { label: "10 Comments", price: "4.99", originalPrice: "8.99", quantity: 10 },
        { label: "25", discount: "$3 OFF", price: "9.99", originalPrice: "12.99", quantity: 25 },
        { label: "50", discount: "$5 OFF", price: "17.99", originalPrice: "22.99", quantity: 50 },
        {
          label: "100",
          discount: "$10 OFF",
          highlight: "BEST SELLING",
          price: "29.99",
          originalPrice: "39.99",
          quantity: 100,
        },
        { label: "250", discount: "$25 OFF", price: "59.99", originalPrice: "84.99", quantity: 250 },
        { label: "500", discount: "$50 OFF", price: "99.99", originalPrice: "149.99", quantity: 500 },
      ],
      premium: [
        { label: "10 Comments", price: "5.99", originalPrice: "9.99", quantity: 10 },
        { label: "25", discount: "$3 OFF", price: "11.99", originalPrice: "14.99", quantity: 25 },
        { label: "50", discount: "$5 OFF", price: "19.99", originalPrice: "24.99", quantity: 50 },
        {
          label: "100",
          discount: "$10 OFF",
          highlight: "BEST SELLING",
          price: "34.99",
          originalPrice: "44.99",
          quantity: 100,
        },
        { label: "250", discount: "$25 OFF", price: "69.99", originalPrice: "94.99", quantity: 250 },
        { label: "500", discount: "$50 OFF", price: "109.99", originalPrice: "159.99", quantity: 500 },
      ],
    },
    followers: {
      highQuality: [
        { label: "100 Followers", price: "2.99", originalPrice: "5.99", quantity: 100 },
        { label: "250", discount: "$3 OFF", price: "5.99", originalPrice: "8.99", quantity: 250 },
        { label: "500", discount: "$5 OFF", price: "9.99", originalPrice: "14.99", quantity: 500 },
        {
          label: "1K",
          discount: "$10 OFF",
          highlight: "BEST SELLING",
          price: "17.99",
          originalPrice: "27.99",
          quantity: 1000,
        },
        { label: "2.5K", discount: "$25 OFF", price: "34.99", originalPrice: "59.99", quantity: 2500 },
        { label: "5K", discount: "$50 OFF", price: "64.99", originalPrice: "114.99", quantity: 5000 },
        { label: "10K", discount: "$100 OFF", price: "119.99", originalPrice: "219.99", quantity: 10000 },
      ],
      premium: [
        { label: "100 Followers", price: "3.99", originalPrice: "6.99", quantity: 100 },
        { label: "250", discount: "$3 OFF", price: "7.99", originalPrice: "10.99", quantity: 250 },
        { label: "500", discount: "$5 OFF", price: "12.99", originalPrice: "17.99", quantity: 500 },
        {
          label: "1K",
          discount: "$10 OFF",
          highlight: "BEST SELLING",
          price: "20.99",
          originalPrice: "30.99",
          quantity: 1000,
        },
        { label: "2.5K", discount: "$25 OFF", price: "39.99", originalPrice: "64.99", quantity: 2500 },
        { label: "5K", discount: "$50 OFF", price: "74.99", originalPrice: "124.99", quantity: 5000 },
        { label: "10K", discount: "$100 OFF", price: "139.99", originalPrice: "239.99", quantity: 10000 },
      ],
    },
  },
  tiktok: {
    followers: [
      { label: "100 Followers", price: "3.99", originalPrice: "6.99", quantity: 100 },
      { label: "250", discount: "$3 OFF", price: "7.99", originalPrice: "10.99", quantity: 250 },
      { label: "500", discount: "$5 OFF", price: "12.99", originalPrice: "17.99", quantity: 500 },
      {
        label: "1K",
        discount: "$10 OFF",
        highlight: "BEST SELLING",
        price: "20.99",
        originalPrice: "30.99",
        quantity: 1000,
      },
      { label: "2.5K", discount: "$25 OFF", price: "39.99", originalPrice: "64.99", quantity: 2500 },
      { label: "5K", discount: "$50 OFF", price: "74.99", originalPrice: "124.99", quantity: 5000 },
      { label: "10K", discount: "$100 OFF", price: "139.99", originalPrice: "239.99", quantity: 10000 },
    ],
    likes: [
      { label: "100 Likes", price: "2.99", originalPrice: "4.99", quantity: 100 },
      { label: "250", discount: "$3 OFF", price: "5.99", originalPrice: "8.99", quantity: 250 },
      { label: "500", discount: "$5 OFF", price: "9.99", originalPrice: "14.99", quantity: 500 },
      {
        label: "1K",
        discount: "$10 OFF",
        highlight: "BEST SELLING",
        price: "17.99",
        originalPrice: "27.99",
        quantity: 1000,
      },
      { label: "2.5K", discount: "$25 OFF", price: "34.99", originalPrice: "59.99", quantity: 2500 },
      { label: "5K", discount: "$50 OFF", price: "64.99", originalPrice: "114.99", quantity: 5000 },
      { label: "10K", discount: "$100 OFF", price: "119.99", originalPrice: "219.99", quantity: 10000 },
    ],
    views: [
      { label: "500 Views", price: "1.99", originalPrice: "3.99", quantity: 500 },
      { label: "1K", discount: "$3 OFF", price: "2.99", originalPrice: "5.99", quantity: 1000 },
      { label: "2.5K", discount: "$3 OFF", price: "4.99", originalPrice: "7.99", quantity: 2500 },
      { label: "5K", discount: "$5 OFF", price: "7.99", originalPrice: "12.99", quantity: 5000 },
      {
        label: "10K",
        discount: "$12 OFF",
        highlight: "BEST SELLING",
        price: "14.99",
        originalPrice: "26.99",
        quantity: 10000,
      },
      { label: "25K", discount: "$33 OFF", price: "29.99", originalPrice: "62.99", quantity: 25000 },
      { label: "50K", discount: "$80 OFF", price: "49.99", originalPrice: "129.99", quantity: 50000 },
    ],
  },
}
const PackagesSection = ({ platform, serviceType }) => {
  const navigate = useNavigate()
  const [selectedQuality] = useState(platform === "instagram" ? "highQuality" : "default") // 'highQuality' or 'premium' for Instagram, 'default' for TikTok
  const [selectedIndex, setSelectedIndex] = useState(0)

  const currentPackages =
    platform === "instagram"
      ? packagesData[platform][serviceType][selectedQuality]
      : packagesData[platform][serviceType]

  const selectedPackage = currentPackages[selectedIndex]

  const handleBuyNow = () => {
    navigate("/checkout", {
      state: {
        packageDetails: {
          packageTitle: selectedPackage.label,
          price: selectedPackage.price,
          quantity: selectedPackage.quantity,
          platform: platform,
          serviceType: serviceType,
          quality: selectedQuality,
        },
      },
    })
  }

  return (
    <div className="max-w-md mx-auto pb-8">
      
      <section className="rounded-b-2xl shadow-xl px-6 border border-gray-300 border-t-0">
        <div className="grid grid-cols-3 gap-4">
          {currentPackages.map((pkg, index) => (
            <PackageCard
              key={index}
              {...pkg}
              selected={index === selectedIndex}
              onClick={() => setSelectedIndex(index)}
            />
          ))}
        </div>

        <div className="text-center mt-6">
          <p className="text-2xl font-bold text-gray-900">
            <span className="text-pink-600">${selectedPackage.price}</span>{" "}
            {selectedPackage.originalPrice && (
              <span className="line-through text-gray-400 text-sm">${selectedPackage.originalPrice}</span>
            )}
          </p>
          <button
            onClick={handleBuyNow}
            className="w-full mt-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white py-3 rounded-xl font-bold shadow-md hover:opacity-90 transition"
          >
            BUY NOW
          </button>
          {selectedPackage.originalPrice && (
            <p className="text-sm text-[#FF1010] mt-2">
              You Save $
              {(Number.parseFloat(selectedPackage.originalPrice) - Number.parseFloat(selectedPackage.price)).toFixed(2)}
            </p>
          )}
        </div>
      </section>

      
    </div>
  )
}

export default PackagesSection