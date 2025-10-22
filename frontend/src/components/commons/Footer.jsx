import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();
  const date = new Date();
  const year = date.getFullYear();
  
  const links = [
    {
      name: "FAQs",
      url: "/faq",
    },
    // {
    //   name: "Blog",
    //   url: "/#blog",
    // },
     {
      name: "Terms & Privacy",
      url: "/terms",
    },
    {
      name: "About Us",
      url: "/about",
    },
    // {
    //   name: "Our Team",
    //   url: "/#team",
    // },
    {
      name: "Contact Us",
      url: "/contact-us",
    },
   
    // {
    //   name: "Privacy Policy",
    //   url: "/#privacy",
    // },
  ];
  
  const instagramServices = [
    {
      name: "Buy Instagram Likes",
      url: "/instagram",
    },
    // {
    //   name: "Buy Instagram Comments",
    //   url: "/instagram",
    // },
    {
      name: "Buy Instagram Followers",
      url: "/instagram",
    },
    {
      name: "Buy Instagram Views",
      url: "/instagram",
    },
   
  ];
  
  const tiktokServices = [
    {
      name: "Buy Tiktok Likes",
      url: "/tiktok",
    },
    {
      name: "Buy Tiktok Followers",
      url: "/tiktok",
    },
    {
      name: "Buy Tiktok Views",
      url: "/tiktok",
    },
  ];

  const handleNavigation = (url) => {
    // Scroll to top before navigation
    window.scrollTo(0, 0);
    
    // If it's a hash link, scroll to the section
    if (url.startsWith('/#')) {
      const sectionId = url.substring(2);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to the page
      navigate(url);
    }
  };

  return (
    <div className="footer-container bg-white py-10 md:py-20 border-t border-gray-200">
      <div className="custom-container">
        {/* Main Footer Grid for Desktop, stacked for Mobile */}
        <div className="flex flex-col md:grid md:grid-cols-4 gap-8 md:gap-16">

          {/* Column 1: Links (FAQ, About Us, etc.) */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-lg text-gray-800 md:mb-4">Company Info</h4>
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(link.url)}
                className="block text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium text-left w-full"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Column 2: Instagram Services */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-lg text-gray-800 md:mb-4">Instagram Services</h4>
            {instagramServices.map((service, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(service.url)}
                className="block text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium text-left w-full"
              >
                {service.name}
              </button>
            ))}
          </div>

          {/* Column 3: TikTok Services */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-lg text-gray-800 md:mb-4">TikTok Services</h4>
            {tiktokServices.map((service, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(service.url)}
                className="block text-gray-600 hover:text-orange-500 transition-colors text-sm font-medium text-left w-full"
              >
                {service.name}
              </button>
            ))}
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-4 md:col-span-1">
            <h4 className="font-semibold text-lg text-gray-800 md:mb-4">Payment Methods</h4>
            <div className="flex flex-wrap gap-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <i className="fa-brands fa-cc-visa text-2xl text-blue-600"></i>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <i className="fa-brands fa-cc-mastercard text-2xl text-red-600"></i>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <i className="fa-brands fa-cc-amex text-2xl text-blue-800"></i>
              </div>
              <div className="bg-gray-100 p-2 rounded-lg">
                <i className="fa-brands fa-apple-pay text-2xl text-black"></i>
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mt-3">
              Secure payment processing
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center md:flex md:justify-between md:items-center">
          <p className="text-sm text-gray-500 font-medium mb-2 md:mb-0">
            Copyright © {year} hypeis.us All rights reserved..
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <span>Made with ❤️ in the USA</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
