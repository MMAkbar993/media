import React from 'react';

const ScrollingMarquee = () => {
  const logos = [
    {
      name: "Hubspot",
      url: "https://blog.hubspot.com/marketing/why-use-instagram-business",
      logo: "https://vivanda.in/wp-content/uploads/2024/07/vivanda-featured-img-the-asian-age.png"
    },
    {
      name: "Deccan Herald",
      url: "https://www.deccanherald.com/amp/brandspot/buy-instagram-likes",
      logo: "https://vivanda.in/wp-content/uploads/2024/07/vivanda-featured-img-times-food-awards.png"
    },
    {
      name: "Seattle Met",
      url: "https://www.seattlemet.com/sponsored/2024/10/buy-instagram-followers",
      logo: "https://vivanda.in/wp-content/uploads/2024/07/vivanda-featured-img-vogue.png"
    },
    {
      name: "Buffzone",
      url: "https://www.dailycamera.com/2024/09/09/best-site-to-buy-instagram-followers/",
      logo: "https://vivanda.in/wp-content/uploads/2024/07/vivanda-featured-img-afternoon.png"
    },
    {
      name: "Radar Online",
      url: "https://radaronline.com/p/buy-instagram-followers/",
      logo: "https://vivanda.in/wp-content/uploads/2024/07/vivanda-featured-img-bazzar.png"
    }
  ];

  const LogoList = ({ logos }) => (
    <ul className="flex gap-12 w-[60rem] justify-start">
      {logos.map((logo, index) => (
        <li key={index} className="flex-shrink-0">
          <a 
            href={logo.url} 
            rel="nofollow"
            target="_blank"
            className="block opacity-70 hover:opacity-100 transition-opacity duration-300"
          >
            <img 
              src={logo.logo} 
              alt={logo.name} 
              className="h-[5rem] w-auto grayscale hover:grayscale-0 transition-all duration-300"
            />
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="w-full bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-8">
          Featured In
        </h2>
        
        <div className="relative overflow-hidden py-4">
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes scroll {
                0% {
                  transform: translateX(0);
                }
                100% {
                  transform: translateX(-50%);
                }
              }
              
              .marquee-content {
                display: flex;
                animation: scroll 10s linear infinite;
              }
              
              .marquee-content:hover {
                animation-play-state: paused;
              }
            `
          }} />
          
          <div className="marquee-content">
            {/* First set of logos */}
            <div className="flex gap-12 w-[60rem]" >
              <LogoList logos={logos} />
            </div>
            
            {/* Second set of logos for seamless loop */}
            <div className="flex gap-12 min-w-full">
              <LogoList logos={logos} />
            </div>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-6">
          Trusted by leading publications and media outlets
        </p>
      </div>
    </div>
  );
};

export default ScrollingMarquee;