"use client"

import { useState } from "react"

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-800"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <svg
          className={`w-5 h-5 transform transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 5v14m7-7H5" />
        </svg>
      </button>
      <div className={`transition-all duration-300 px-0 overflow-hidden ${isOpen ? "max-h-40 py-3" : "max-h-0"}`}>
        <p className="text-sm text-gray-600">{answer}</p>
      </div>
    </div>
  )
}

/**
 * A component that renders a list of FAQs for the given renderIn type, with a heading and description.
 *
 * @param {string} renderIn - The type of FAQs to render. Supported values are "Likes", "Views", and "Comments".
 * @param {string} des - The description text to display below the heading.
 */
const FAQSection = ({ renderIn, des }) => {
  const faqs = {
    Likes: [
      {
        question: "Is this safe to use?",
        answer: "Yes! We encrypt all data for complete anonymity. We ensure our delivery methods are safe, you will not be banned for using our service.",
      },
      {
        question: "Which package should I choose?",
        answer: "The best package depends on your needs. Our 'Most Popular' option is a great starting point for most.",
      },
      {
        question: "How does your warranty work?",
        answer: "All orders are backed with a 14 day warranty. If none of your service delivers, we will happily refund you.",
      },
      {
        question: "What if there's an issue with my order?",
        answer: "Please contact our support team, we strive to create a headache-free experience. See a few engagements fall off? This is normal, just request a refill during the warranty period and we will recoup your purchase instantly.",
      },
      {
        question: "How quickly does this work?",
        answer: "You will typically start seeing engagement within minutes of purchasing, thanks to our quick processing methods.",
      },
      {
        question: "Are these real likes, views, followers?",
        answer: "Influencers have used our service to boost their engagement. We maintain and leverage our own accounts for a smooth process. We aim to provide from a range of premium accounts, we do not guarantee active accounts. The accounts are not real. If any platform suggests so, they are lying to you.",
      },
      {
        question: "What does 'splitting likes' mean?",
        answer: "Splitting likes means you can distribute the purchased likes across multiple posts on your Instagram profile.",
      },
      {
        question: "What if I have a question you haven't answered?",
        answer: "Our dedicated customer support team is available 24/7 to answer any questions you may have.",
      },
    ],
    Views: [
      {
        question: "Is this safe to use?",
        answer: "Yes! We encrypt all data for complete anonymity. We ensure our delivery methods are safe, you will not be banned for using our service.",
      },
      {
        question: "Which package should I choose?",
        answer: "The best package depends on your needs. Our 'Most Popular' option is a great starting point for most.",
      },
      {
        question: "How does your warranty work?",
        answer: "All orders are backed with a 14 day warranty. If none of your service delivers, we will happily refund you.",
      },
      {
        question: "What if there's an issue with my order?",
        answer: "Please contact our support team, we strive to create a headache-free experience. See a few engagements fall off? This is normal, just request a refill during the warranty period and we will recoup your purchase instantly.",
      },
      {
        question: "How quickly does this work?",
        answer: "You will typically start seeing engagement within minutes of purchasing, thanks to our quick processing methods.",
      },
      {
        question: "Are these real likes, views, followers?",
        answer: "Influencers have used our service to boost their engagement. We maintain and leverage our own accounts for a smooth process. We aim to provide from a range of premium accounts, we do not guarantee active accounts. The accounts are not real. If any platform suggests so, they are lying to you.",
      },
      {
        question: "What does 'splitting views' mean?",
        answer: "Splitting views means you can distribute the purchased views across multiple videos on your Instagram profile.",
      },
      {
        question: "What if I have a question you haven't answered?",
        answer: "Our dedicated customer support team is available 24/7 to answer any questions you may have.",
      },
    ],
    Comments: [
      {
        question: "Is this safe to use?",
        answer: "Yes! We encrypt all data for complete anonymity. We ensure our delivery methods are safe, you will not be banned for using our service.",
      },
      {
        question: "Which package should I choose?",
        answer: "The best package depends on your needs. Our 'Most Popular' option is a great starting point for most.",
      },
      {
        question: "How does your warranty work?",
        answer: "All orders are backed with a 14 day warranty. If none of your service delivers, we will happily refund you.",
      },
      {
        question: "What if there's an issue with my order?",
        answer: "Please contact our support team, we strive to create a headache-free experience. See a few engagements fall off? This is normal, just request a refill during the warranty period and we will recoup your purchase instantly.",
      },
      {
        question: "How quickly does this work?",
        answer: "You will typically start seeing engagement within minutes of purchasing, thanks to our quick processing methods.",
      },
      {
        question: "Are these real likes, views, followers?",
        answer: "Influencers have used our service to boost their engagement. We maintain and leverage our own accounts for a smooth process. We aim to provide from a range of premium accounts, we do not guarantee active accounts. The accounts are not real. If any platform suggests so, they are lying to you.",
      },
      {
        question: "What does 'splitting comments' mean?",
        answer: "Splitting comments means you can distribute the purchased comments across multiple posts on your Instagram profile.",
      },
      {
        question: "What if I have a question you haven't answered?",
        answer: "Our dedicated customer support team is available 24/7 to answer any questions you may have.",
      },
    ],
  };



  const currentFaqs = faqs[renderIn] || faqs.Likes // Default to Likes if renderIn is not found

  return (
    <div className="bg-white py-12 px-4 md:px-8 max-w-5xl mx-auto">
      <h2 className="text-4xl font-semibold text-center">
        <span className="text-orange-500">Buy Instagram {renderIn}</span> Easily With hypeis.us
      </h2>
      <p className="text-center text-gray-600 mt-2">{des}</p>

      <div className="flex flex-wrap items-start justify-center gap-4 mt-10">
        {currentFaqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden w-full md:w-[48%] px-4">
            <FAQItem question={faq.question} answer={faq.answer} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQSection