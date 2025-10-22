import { useEffect, useState } from "react"
import { Star, Check } from "lucide-react"
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

// Mock components for demo
const AnimationContainer = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount(prev => prev < value ? prev + Math.ceil(value / 50) : value);
    }, 50);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
};

const OrderModal = ({ isOpen, onClose, platform, serviceType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Order {platform} {serviceType}</h3>
        <p className="text-gray-600 mb-4">This would open the order modal for {platform} {serviceType}</p>
        <button
          onClick={onClose}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function Buy({
  title = "",
  description = "",
  features = [
   
  ],
  cta = "",
  bg = "bg-gradient-to-br from-purple-100 to-pink-100",
  card1Title = "",
  card1Content = "",
  card1Image = "https://via.placeholder.com/40x40/ff6b6b/ffffff?text=F",
  card2Title = "",
  card2Content = "",
  card2Image = "https://via.placeholder.com/40x40/4ecdc4/ffffff?text=S",
  card3Title = "24/7 Support",
  card3Content = "",
  card3Image = "/images/call.png",
  platform = "",
  serviceType = "",
  link, // New prop for the link destination
}) {
  const [animate, setAnimate] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate(true)
      setTimeout(() => setAnimate(false), 800)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleOrderClick = () => {
    if (link) {
      console.log(`Would navigate to: ${link}`);
      navigate(link);
    } else {
      setIsModalOpen(true);
    }
  }

  // Button component that can handle both link and modal
  const ButtonComponent = ({ children, className, ...props }) => {
    return (
      <button onClick={handleOrderClick} className={className} {...props}>
        {children}
      </button>
    )
  }

  return (
    <>
      <div className={`${bg} my-8 py-6 rounded-3xl overflow-hidden shadow-lg`}>
        <div className="max-w-2xl mx-auto px-4">
          
          {/* Desktop Layout - PROPERLY HIDDEN ON MOBILE */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-start gap-8">
              {/* Service Details - Now takes more space */}
              <div className="w-full lg:w-2/3">
                <div className="flex items-center text-xs w-fit rounded-full mb-6">
                  <span className="font-semibold bg-white px-3 py-2 rounded-l-full flex gap-1 shadow-md">
                    <Star className={`text-green-500 w-4 h-4 fill-current ${animate ? "animate-spin" : ""}`} />
                    5.0
                  </span>
                  <span className="bg-black/10 text-gray-700 font-semibold rounded-r-full px-3 py-2">
                    <AnimationContainer value={1045} />
                  </span>
                </div>

                <h3 className="text-3xl font-bold text-gray-800 mb-6">{title}</h3>

                <div className="grid grid-cols-1 gap-3 mb-8">
                  {features.slice(0, 6).map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="mr-3 bg-white w-5 h-5 flex items-center justify-center rounded-full shadow-sm flex-none mt-0.5">
                        <Check className="text-orange-400 w-3 h-3" />
                      </span>
                      <span className="text-gray-700 font-medium text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
             
              {/* Three Compact Info Cards */}
              <div className="w-full lg:w-1/3 space-y-3 mb-2">
                {/* Simplified Card 1 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    {card1Image && (
                      <img src={card1Image} alt={card1Title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{card1Title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{card1Content}</p>
                    </div>
                  </div>
                </div>

                {/* Simplified Card 2 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    {card2Image && (
                      <img src={card2Image} alt={card2Title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{card2Title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{card2Content}</p>
                    </div>
                  </div>
                </div>

                {/* Simplified Card 3 */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                  <div className="flex items-center gap-3">
                    {card3Image && (
                      <img src={card3Image} alt={card3Title} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h4 className="font-semibold text-sm text-gray-800 truncate">{card3Title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{card3Content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop CTA Button */}
            <div className="w-full">
              <ButtonComponent
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold transition-all duration-300 uppercase text-lg hover:shadow-xl transform hover:scale-105 inline-block text-center"
              >
                {cta}
              </ButtonComponent>
            </div>
          </div>

          {/* Mobile Layout - ONLY SHOWS ON MOBILE */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Header with Rating */}
            <div className="text-center">
              <div className="flex items-center justify-center text-xs w-fit rounded-full mb-4 mx-auto">
                <span className="font-semibold bg-white px-3 py-2 rounded-l-full flex gap-1 shadow-md">
                  <Star className={`text-green-500 w-4 h-4 fill-current ${animate ? "animate-spin" : ""}`} />
                  5.0
                </span>
                <span className="bg-black/10 text-gray-700 font-semibold rounded-r-full px-3 py-2">
                  <AnimationContainer value={1045} />
                </span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{title}</h2>
              {/* Description is now hidden on mobile by removing this line:
              <p className="text-gray-600 mb-6 text-sm sm:text-base">{description}</p> */}
            </div>

            {/* Mobile Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {features.slice(0, 6).map((feature, index) => (
                <div key={index} className="flex items-start text-sm text-gray-700">
                  <Check className="h-4 w-4 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Mobile CTA Button */}
            <div className="flex justify-center">
              <ButtonComponent
                className="px-6 py-4 w-full max-w-md text-base sm:text-lg font-semibold rounded-xl text-white
                           bg-gradient-to-r from-orange-500 to-red-500
                           hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg uppercase
                           transform hover:scale-105 inline-block text-center"
              >
                {cta}
              </ButtonComponent>
            </div>

            {/* Three Compact Mobile Cards */}
            <div className="space-y-3">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="flex items-center gap-3">
                  {card1Image && (
                    <img src={card1Image} alt={card1Title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800">{card1Title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{card1Content}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="flex items-center gap-3">
                  {card2Image && (
                    <img src={card2Image} alt={card2Title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800">{card2Title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{card2Content}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20">
                <div className="flex items-center gap-3">
                  {card3Image && (
                    <img src={card3Image} alt={card3Title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h4 className="font-semibold text-sm text-gray-800">{card3Title}</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{card3Content}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        platform={platform}
        serviceType={serviceType}
      />
    </>
  )
}