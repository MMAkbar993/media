import React, { useEffect, useRef, useState } from "react";

export default function ShowcaseSection() {
  // Smaller, tighter messages
  const messages = [
    { text: "100 followers delivered", time: "2 mins ago" },
    { text: "500 views delivered", time: "6 mins ago" },
    { text: "50 likes delivered", time: "12 mins ago" },
    { text: "250 followers delivered", time: "25 mins ago" },
  ];

  // Duplicate messages for seamless loop
  const duplicatedMessages = [...messages, ...messages];

  const [translateY, setTranslateY] = useState(0);
  const animationRef = useRef();

  useEffect(() => {
    const animate = () => {
      setTranslateY(prev => {
        const messageHeight = 40; // Height of each message in pixels (h-10 = 40px)
        const totalHeight = messages.length * messageHeight;
        const newY = prev + 0.5; // Scroll speed - adjust this value to change speed
        
        // Reset to 0 when we've scrolled through all original messages
        return newY >= totalHeight ? 0 : newY;
      });
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [messages.length]);

  return (
    <div className="flex flex-col items-center mx-auto py-3 lg:px-24 gap-y-3 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-y-0">
      
      {/* Mobile: Stars and Apple Pay in horizontal row */}
      <div className="flex items-center justify-between w-full max-w-sm px-4 md:hidden">
        {/* Stars (mobile) */}
        <div className="flex items-center">
          <ul className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <li key={i}>
                <svg width="18" height="18" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M4.78977 -0.00292969C2.30622 -0.00292969 0.292908 2.01039 0.292908 4.49394V21.2528C0.292908 23.7364 2.30622 25.7497 4.78977 25.7497H21.5487C24.0322 25.7497 26.0455 23.7364 26.0455 21.2528V4.49394C26.0455 2.01039 24.0322 -0.00292969 21.5487 -0.00292969H4.78977ZM7.31955 10.8464C6.63222 10.944 6.34972 11.7832 6.83811 12.2766L9.08307 14.5445C9.27545 14.7388 9.36181 15.0143 9.31481 15.2837L8.76471 18.4367C8.64405 19.1283 9.37092 19.6565 9.99146 19.3282L12.7257 17.8818C12.9761 17.7493 13.2764 17.7512 13.5251 17.887L16.2418 19.3697C16.8579 19.706 17.5915 19.1875 17.4801 18.4945L16.9715 15.3311C16.9281 15.0612 17.0181 14.7869 17.213 14.5951L19.4836 12.3613C19.9785 11.8744 19.7071 11.0315 19.0211 10.9249L15.9359 10.4456C15.6597 10.4027 15.4226 10.2258 15.3028 9.9733L13.9544 7.13312C13.6512 6.49458 12.7446 6.48884 12.4333 7.12349L11.0506 9.94331C10.9274 10.1944 10.688 10.3683 10.4111 10.4076L7.31955 10.8464Z"
                    fill="#38C793"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>

        {/* Apple Pay (mobile) */}
        <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-gray-50">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Pay
        </button>
      </div>

      {/* Desktop: Stars (left side) */}
      <div className="hidden md:block relative pr-4 mr-4 leading-none">
        <ul className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <li key={i}>
              <svg width="20" height="20" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.78977 -0.00292969C2.30622 -0.00292969 0.292908 2.01039 0.292908 4.49394V21.2528C0.292908 23.7364 2.30622 25.7497 4.78977 25.7497H21.5487C24.0322 25.7497 26.0455 23.7364 26.0455 21.2528V4.49394C26.0455 2.01039 24.0322 -0.00292969 21.5487 -0.00292969H4.78977ZM7.31955 10.8464C6.63222 10.944 6.34972 11.7832 6.83811 12.2766L9.08307 14.5445C9.27545 14.7388 9.36181 15.0143 9.31481 15.2837L8.76471 18.4367C8.64405 19.1283 9.37092 19.6565 9.99146 19.3282L12.7257 17.8818C12.9761 17.7493 13.2764 17.7512 13.5251 17.887L16.2418 19.3697C16.8579 19.706 17.5915 19.1875 17.4801 18.4945L16.9715 15.3311C16.9281 15.0612 17.0181 14.7869 17.213 14.5951L19.4836 12.3613C19.9785 11.8744 19.7071 11.0315 19.0211 10.9249L15.9359 10.4456C15.6597 10.4027 15.4226 10.2258 15.3028 9.9733L13.9544 7.13312C13.6512 6.49458 12.7446 6.48884 12.4333 7.12349L11.0506 9.94331C10.9274 10.1944 10.688 10.3683 10.4111 10.4076L7.31955 10.8464Z"
                  fill="#38C793"
                />
              </svg>
            </li>
          ))}
        </ul>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-5 md:h-7 bg-gray-400/30" />
      </div>

      {/* Notification with continuous scroll (center) */}
      <div className="flex justify-center w-full md:w-auto">
        <div className="relative w-[320px] sm:w-[380px] md:w-[420px] h-10 md:h-12 rounded-xl bg-emerald-50 ring-1 ring-emerald-200/40 overflow-hidden shadow-sm">
          {/* left & right hairlines (desktop only) */}
          <span className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-px h-5 md:h-7 bg-gray-400/30" />
          <span className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-px h-5 md:h-7 bg-gray-400/30" />

          <div
            className="will-change-transform"
            style={{ 
              transform: `translateY(-${translateY}px)`,
            }}
          >
            {duplicatedMessages.map((msg, i) => (
              <div key={i} className="flex items-center justify-between h-10 md:h-12 px-3">
                <div className="flex items-center">
                  <span className="relative">
                    <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="ml-2 text-sm md:text-base">
                    <span className="font-semibold">{msg.text}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 text-xs md:text-sm">
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="currentColor" aria-hidden="true">
                    <path d="M10.9436 0.563382C11.4318 1.05154 11.4318 1.84299 10.9436 2.33115L5.5712 7.70357C5.08305 8.19172 4.29161 8.19172 3.80345 7.70358L0.799179 4.69944C0.311014 4.21129 0.310997 3.41984 0.799143 2.93167C1.28729 2.44351 2.07874 2.44349 2.56691 2.93164L4.68729 5.05193L9.17585 0.563382C9.664 0.0752268 10.4555 0.0752268 10.9436 0.563382Z" />
                  </svg>
                  {msg.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop: Apple Pay (right side) */}
      <div className="hidden md:flex relative md:ml-4 md:pl-4">
        <button className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1 text-sm font-semibold shadow-sm hover:bg-gray-50">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Pay
        </button>
      </div>
    </div>
  );
}