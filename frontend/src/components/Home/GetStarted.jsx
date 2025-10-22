import { TiChevronRight } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { Heart, Users, Eye, MessageCircle } from 'lucide-react';

const GetStarted = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: "Buy Instagram Likes",
      url: "/instagram",
      icon: Heart,
      category: "instagram"
    },
    {
      name: "Buy Instagram Followers",
      url: "/instagram",
      icon: Users,
      category: "instagram"
    },
    {
      name: "Buy Instagram Views",
      url: "/instagram",
      icon: Eye,
      category: "instagram"
    },
  ];

  const services2 = [
    {
      name: "Buy Tiktok Likes",
      url: "/tiktok",
      icon: Heart,
      category: "tiktok"
    },
    {
      name: "Buy Tiktok Views",
      url: "/tiktok",
      icon: Eye, // Fixed: was Users, should be Eye for views
      category: "tiktok"
    },
    {
      name: "Buy Tiktok Followers",
      url: "/tiktok",
      icon: Users, // Fixed: was Eye, should be Users for followers
      category: "tiktok"
    },
  ];

  const handleServiceClick = (url) => {
    navigate(url);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-100 py-24">
      <div className="custom-container">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-12">
          {/* Text Section */}
          <div className="md:col-span-5 order-1 md:order-none flex items-center justify-center">
            <div className="space-y-6 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Get Started Now
              </h1>
              <h2 className="text-gray-700 font-medium text-xl leading-relaxed">
                Over 50,000 daily customers trust us for their marketing tactics. With our money back guarantee, you can trust the best in the business to care for you.
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Join our family of customers and see why we're top rated. Our extended warranty has you covered.
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div className="md:col-start-9 md:col-span-4 order-2 md:order-none">
            <div className="space-y-6">
              {/* Instagram Services */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  Instagram Services
                </h3>
                {services.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleServiceClick(service.url)}
                      className="group flex items-center justify-between w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-pink-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">
                          {service.name}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200">
                        <TiChevronRight className="text-gray-600 text-sm" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* TikTok Services */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 pt-4">
                  TikTok Services
                </h3>
                {services2.map((service, index) => {
                  const IconComponent = service.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => handleServiceClick(service.url)}
                      className="group flex items-center justify-between w-full bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl px-5 py-4 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="font-medium text-gray-800 text-sm">
                          {service.name}
                        </span>
                      </div>
                      <div className="w-8 h-8 bg-gray-100 group-hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200">
                        <TiChevronRight className="text-gray-600 text-sm" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;