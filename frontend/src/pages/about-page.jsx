import React, { useState } from 'react';
import { ChevronDown, Check, Users, Award, TrendingUp, Shield, Clock, Star } from 'lucide-react';

export default function BuzzoidAboutPage() {
  const [expandedCard, setExpandedCard] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  // const timelineItems = [
  //   {
  //     year: "2011",
  //     title: "The Beginning",
  //     content: "A close-knit group of social media experts came together and decided to create the first service to understand Instagram from the inside.",
  //     subContent: "They studied and then reverse-engineered the all-important Instagram algorithms, which are responsible for allocating visibility and enforcing the platform's rules on engagements. What they learned — including the fact that real interactions were the key to growth — convinced them that they were ready to offer services to users of the new social media app."
  //   },
  //   {
  //     year: "2012",
  //     title: "Buzzoid Launch",
  //     content: "Buzzoid opened as the first full-service Instagram provider to offer packages of legitimate Instagram followers, likes, and video views. The response was overwhelming.",
  //     subContent: "New social media experts joined Buzzoid to provide their expertise, including several who had worked at Instagram and other platforms - giving Buzzoid more insight than any competitor into the app's operations."
  //   },
  //   {
  //     year: "2014",
  //     title: "Rapid Growth",
  //     content: "Buzzoid became the go-to service for influencers and businesses looking to grow their Instagram presence authentically.",
  //     subContent: "Our team expanded globally and we refined our algorithms to provide even better results for our customers."
  //   },
  //   {
  //     year: "2018",
  //     title: "Platform Expansion",
  //     content: "We expanded our services to include TikTok, YouTube, and other emerging social media platforms.",
  //     subContent: "Our expertise in understanding social media algorithms allowed us to quickly adapt to new platforms and provide the same high-quality results."
  //   },
  //   {
  //     year: "2023",
  //     title: "Industry Leader",
  //     content: "Buzzoid became the world's #1 social media growth service, trusted by over 1 million customers worldwide.",
  //     subContent: "We continue to innovate and provide the best service in the industry, maintaining our position as the market leader."
  //   }
  // ];

  const features = [
    "The first service to hire social media platform insiders for unique insights",
    "The first service to provide 24/7 customer support",
    "Over a decade of proven results and customer satisfaction",
    "Real followers from authentic accounts - no bots or fake profiles",
    "Industry-leading delivery speeds and reliability",
    "Comprehensive privacy protection and secure transactions",
    "Money-back satisfaction guarantee",
    "Trusted by celebrities, influencers, and major brands",
    "Advanced algorithm understanding for maximum effectiveness",
    "Continuous service improvements based on platform updates"
  ];

  const faqItems = [
    {
      question: "Why should I buy Instagram followers?",
      answer: "We live in a world of social media. To date, there are more than two billion active Instagram users and almost as many TikTok users - and those numbers are growing by the day! However, you have little hope of making your mark if you have very few followers, and that's where hypeis.us comes in! We provide the missing ingredient — know-how — and make Instagram and TikTok growth easy.",
      points: [
        "Instant delivery (no waiting for growth)",
        "Highest quality followers on the market (no fake accounts)",
        "24/7 customer support (just one element of our outstanding service)",
        "Perfect for TikTok and Instagram marketing (reaching the For You or Explore pages)"
      ]
    },
    {
      question: "Are the followers real people?",
      answer: "Yes! We've built an enormous network of REAL Instagram users with REAL accounts. When we receive an order, we have these REAL people follow accounts, like posts, view videos, and post comments — and that's exactly what the system's algorithms want to see."
    },
    {
      question: "How quickly will I receive my followers?",
      answer: "Most orders begin processing within minutes and are typically completed within 24-48 hours. The exact timing depends on the size of your order and current demand."
    },
    {
      question: "Is it safe to buy Instagram followers?",
      answer: "Absolutely! Our methods are completely safe and compliant with Instagram's terms of service. We use real people and authentic engagement methods, never bots or fake accounts that could put your account at risk."
    }
  ];

  return (
    <main role="main" tabIndex={-1} className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pt-16 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                About Us
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          hypeis.us is the world's leading provider of high-quality Instagram followers, likes, views, and comments.
              We were founded in 2012 by a group of social media experts who wanted to help others grow their Instagram
              profiles. Since then,{" "}
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                hypeis.us has become a social media service powerhouse.
              </span>
            </p>
          </div>

          {/* Feature Sections */}
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
                <div className="text-sm font-semibold text-blue-200 mb-2">Why hypeis.us?</div>
                <h2 className="text-3xl font-bold mb-6">Over a Decade of Experience</h2>
                <p className="text-lg mb-4 text-blue-100">
                  For more than twelve years, our staff of social media experts has been studying Instagram, TikTok, and
                  other apps from the inside.
                </p>
                <p className="text-blue-200">
                  They've analyzed and replicated the all-important system algorithms, allowing them to understand
                  exactly how the platforms work — and more importantly, how they reward some users and penalize others.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="w-full h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center">
                <Award className="w-32 h-32 text-white" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="w-full h-96 bg-gradient-to-br from-green-400 to-blue-500 rounded-3xl flex items-center justify-center">
                <Users className="w-32 h-32 text-white" />
              </div>
            </div>
            <div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-3xl p-8 text-white">
                <div className="text-sm font-semibold text-green-200 mb-2">How is hypeis.us Different?</div>
                <h2 className="text-3xl font-bold mb-6">Trusted by Our Clients</h2>
                <p className="text-lg mb-4 text-green-100">
                  Our knowledge and experience have allowed hypeis.us to become the Instagram and TikTok service provider
                  that thousands of people rely on.
                </p>
                <p className="text-green-200">
                  We've helped countless users improve their social media presence by delivering billions of
                  interactions on Instagram and TikTok.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-16 h-16" />,
                title: "Only Real Engagements",
                content: "Our team's most important discovery? It's simply that fake interactions — the type that other services deliver with the use of fake accounts and bots — are quickly disregarded and removed by Instagram and TikTok. Even worse, accounts are often penalized or deactivated for using those \"short-cut\" providers. This understanding has allowed us to build social media visibility and popularity models that work."
              },
              {
                icon: <Star className="w-16 h-16" />,
                title: "Our Guarantee",
                content: "We've built an enormous network of REAL Instagram users with REAL accounts. When we receive an order, we have these REAL people follow accounts, like posts, view videos, and post comments — and that's exactly what the system's algorithms want to see."
              },
              {
                icon: <TrendingUp className="w-16 h-16" />,
                title: "Effective Social Growth",
                content: "These REAL interactions are never removed, and they're the secret to hypeis.us ability to boost our customers' engagement rates, popularity, and authority. That's why many of our clients keep coming back."
              }
            ].map((card, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-purple-500 mb-6 flex justify-center">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{card.title}</h3>
                <p className={`text-gray-600 leading-relaxed ${expandedCard === index ? '' : 'line-clamp-3'}`}>
                  {card.content}
                </p>
                <button
                  onClick={() => toggleCard(index)}
                  className="mt-4 flex items-center justify-center w-full text-purple-600 hover:text-purple-800 font-medium"
                >
                  {expandedCard === index ? 'Show Less' : 'Read More'}
                  <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${expandedCard === index ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      {/* <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              How Buzzoid Became the{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                World's #1 Social Media Service:
              </span>
              <br />A Timeline
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              You can't be influential and important on Instagram without a large audience. Big-name actors, musicians,
              athletes, and other celebrities have no trouble building a large follower base when they launch an account
              on the Gram, but for everyone else, it can be a struggle.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-purple-400 to-pink-400 h-full"></div>
            <div className="space-y-12">
              {timelineItems.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-purple-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                      <p className="text-gray-700 mb-4">{item.content}</p>
                      <p className="text-sm text-gray-500">{item.subContent}</p>
                    </div>
                  </div>
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* Features List Section */}
      <section className="bg-white border-t border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                Why hypeis.us is Ranked #1
              </span>
              , Year After Year
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're not the only provider offering Instagram and TikTok interactions for sale. We're the best, though,
              and we want you to feel comfortable trying our services.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-3xl p-12">
            <ul className="grid md:grid-cols-2 gap-6 text-white">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-lg">
                    {feature.includes('first service') ? (
                      <>
                        <span className="font-bold text-orange-200">The first service</span>
                        {feature.replace('The first service', '')}
                      </>
                    ) : (
                      feature
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 border-t border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                  hypeis.us - Your #1 Instagram Provider
                </span>
                <br />
                1,000,000 happy customers can't be wrong!
              </h2>
            </div>

            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="text-lg font-semibold text-gray-900 pr-4">{item.question}</h4>
                    <ChevronDown
                      className={`w-6 h-6 text-gray-500 transition-transform flex-shrink-0 ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`px-8 transition-all duration-300 ease-in-out ${
                      expandedFAQ === index ? 'pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                  >
                    <p className="text-gray-600 mb-4">{item.answer}</p>
                    {item.points && (
                      <ul className="space-y-2">
                        {item.points.map((point, pointIndex) => (
                          <li key={pointIndex} className="flex items-start space-x-2">
                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-600">{point}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Grow Your Social Media Presence?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join over 1 million satisfied customers who have transformed their social media success with hypeis.us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors">
              Get Started Today
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
              View Our Services
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}