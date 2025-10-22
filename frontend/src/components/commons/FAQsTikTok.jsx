"use client"

import { useState } from "react"

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full text-left px-5 py-4 flex justify-between items-start bg-white hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-medium text-gray-800">{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 flex-shrink-0 ml-3 ${isOpen ? "rotate-45" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14m7-7H5" />
        </svg>
      </button>
      <div className={`transition-all duration-300 px-5 overflow-hidden ${isOpen ? "max-h-40 py-3" : "max-h-0"}`}>
        <p className="text-sm text-gray-600">{answer}</p>
      </div>
    </div>
  )
}

const FAQsTikTok = ({ renderIn = "general" }) => {
  const faqData = {
    general: [
      {
        id: 1,
        question: "Is this safe to use?",
        answer: "Yes! We encrypt all data for complete anonymity. We ensure our delivery methods are safe, you will not be banned for using our service. All orders are backed with a 14 day warranty. If none of your service delivers, we will happily refund you."
      },
      {
        id: 2,
        question: "What if there is an issue with my order?",
        answer: "Please contact our support team, we strive to create a headache-free experience. See a few followers fall off? This is normal, just request a refill during the warranty period and we will recoup your followers instantly."
      },
      {
        id: 3,
        question: "Are these real likes, views, followers?",
        answer: "Influencers have used our service to boost their engagement. We maintain and leverage our own accounts for a smooth process. We aim to provide from a range of premium accounts, we do not guarantee active accounts. The accounts are not real. If any platform suggests so, they are lying to you."
      },
      {
        id: 4,
        question: "I did not receive my order, what do I do now?",
        answer: "If you haven't received your order within the expected timeframe, please contact our support team immediately. We'll investigate the issue and either expedite your delivery or provide a full refund within our 14-day warranty period."
      },
      {
        id: 5,
        question: "Why are my followers dropping?",
        answer: "Some follower drop is normal and expected across all social media platforms. This can happen due to platform cleanups or inactive accounts being removed. During our 14-day warranty period, we provide free refills to maintain your follower count."
      },
      {
        id: 6,
        question: "I no longer want the followers I purchased, can they be removed?",
        answer: "Unfortunately, we cannot remove followers once they've been delivered to your account. However, you can remove them manually through your social media platform's settings, though this process may take time depending on the quantity."
      }
    ],
    billing: [
      {
        id: 7,
        question: "How do I stop follower replenishment?",
        answer: "Replenishment automatically stops after the 14-day warranty period. If you wish to stop it earlier, please contact our support team with your order details and we can disable automatic refills for your account."
      },
      {
        id: 8,
        question: "How often does replenishment occur?",
        answer: "We monitor your follower count daily during the warranty period. If we detect a significant drop (usually 10% or more), we automatically trigger a refill within 24-48 hours to maintain your purchased count."
      },
      {
        id: 9,
        question: "How many followers can I buy?",
        answer: "We offer packages ranging from 100 to 100,000+ followers. For larger quantities or custom packages, please contact our support team. We recommend starting with smaller packages to test our service quality."
      },
      {
        id: 10,
        question: "How many likes can I buy?",
        answer: "Like packages range from 50 to 50,000+ likes per post. You can purchase likes for multiple posts, and we offer bulk discounts for larger orders. Custom packages are available upon request."
      }
    ]
  }

  const currentFaqs = faqData[renderIn] || faqData.general // Default to general if renderIn is not found

  const getCategoryTitle = () => {
    switch(renderIn) {
      case 'billing':
        return 'Billing & Orders'
      case 'general':
      default:
        return 'General Questions'
    }
  }

  return (
    <div className="custom-container flex lg:flex-row flex-col gap-10 items-start">
      <div className="lg:w-1/3 w-full flex-shrink-0">
        <p className="heading leading-14">
          Have More Questions About {getCategoryTitle()}?
          <br />
        </p>
        <p className="heading text-gradient mt-5">We Have Answers</p>
      </div>
      <div className="lg:w-2/3 w-full flex flex-col items-start gap-4">
        {currentFaqs.map((faq) => (
          <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden w-full">
            <FAQItem question={faq.question} answer={faq.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQsTikTok