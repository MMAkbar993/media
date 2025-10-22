import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFAQ, setOpenFAQ] = useState(null);

  const categories = [
    { id: 'general', label: 'General Knowledge' },
    { id: 'billing', label: 'Billing Questions' },
  ];

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
  };

  const toggleFAQ = (faqId) => {
    setOpenFAQ(openFAQ === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
            Frequently Asked Questions
            <span className="text-4xl">👋</span>
          </h1>
          <p className="text-gray-600 text-lg">
            Questions? We have answers
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 ${activeCategory === category.id
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:w-3/4">
            <div className="space-y-4">
              {faqData[activeCategory]?.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="text-gray-800 font-medium pr-4">
                      {faq.question}
                    </span>
                    <div className="flex-shrink-0">
                      {openFAQ === faq.id ? (
                        <Minus className="w-5 h-5 text-gray-500" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>

                  {openFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our support team is here to help you 24/7
            </p>
            <Link to="/contact-us">
              <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Contact Support
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;