import React, { useState } from 'react';

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 0L7.34708 4.1459H11.7063L8.17963 6.7082L9.52671 10.8541L6 8.2918L2.47329 10.8541L3.82037 6.7082L0.293661 4.1459H4.65292L6 0Z" fill="#FFD700"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <polygon points="10,8 16,12 10,16" fill="currentColor"/>
  </svg>
);

const TabbedInterface = () => {
  const [activeTab, setActiveTab] = useState('instagram');

  const services = {
    instagram: {
      id: 'instagram',
      name: 'Instagram Services',
      icon: <InstagramIcon />,
      rating: '5',
      users: '3450+',
      isNew: false
    },
    tiktok: {
      id: 'tiktok',
      name: 'TikTok Services', 
      icon: <TikTokIcon />,
      rating: '5',
      users: '2720+',
      isNew: false
    },
    youtube: {
      id: 'youtube',
      name: 'YouTube Services',
      icon: <YouTubeIcon />,
      rating: '5', 
      users: '1560+',
      isNew: true
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Buy Instagram likes, followers, comments<br />
            and other Interactions <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Delivered in Minutes</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Count on Company name #1 ranked growth service to help you build a robust social media presence!
          </p>
        </div>

        {/* Tabbed Interface */}
        <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div role="tablist" className="relative grid grid-cols-3 h-16 sm:h-20 bg-gray-50">
            {Object.values(services).map((service, index) => (
              <div
                key={service.id}
                role="tab"
                aria-selected={activeTab === service.id}
                className={`group relative cursor-pointer transition-all duration-300 ${
                  activeTab === service.id 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(service.id)}
                aria-label={service.name}
              >
                <div className="relative z-10 flex h-full flex-col items-center justify-center gap-x-2 gap-y-1 px-4 md:flex-row lg:gap-x-4">
                  {/* Service Icon */}
                  <div className="relative shrink-0">
                    {service.isNew && (
                      <span className="absolute -top-2 left-1/2 inline-block h-3 -translate-x-1/2 rounded-full bg-gradient-to-r from-pink-400 to-red-500 px-1 text-xs font-bold uppercase leading-3 text-white lg:hidden">
                        NEW
                      </span>
                    )}
                    <span className="service-icon">
                      {service.icon}
                    </span>
                  </div>
                  
                  {/* Service Info */}
                  <div className="flex flex-col gap-y-1.5">
                    <div className={`hidden whitespace-nowrap text-sm font-medium sm:inline-flex items-center gap-x-1.5 ${
                      activeTab === service.id ? 'font-semibold text-blue-700' : 'text-gray-700'
                    }`}>
                      {service.name}
                      {service.isNew && (
                        <span className="hidden h-4 rounded-full bg-gradient-to-r from-pink-400 to-red-500 px-1.5 text-xs font-bold uppercase leading-4 text-white lg:inline-block">
                          NEW
                        </span>
                      )}
                    </div>
                    
                    {/* Rating and Users */}
                    <div className="hidden md:block">
                      <div className="inline-flex items-center text-xs font-semibold">
                        <div className="shrink-0 inline-flex items-center gap-1.5 rounded-l-full rounded-r-md border border-gray-300 bg-white px-2 py-1 shadow-sm">
                          <StarIcon />
                          <span>{service.rating}</span>
                        </div>
                        <div className="items-center rounded-r-full bg-gray-400 bg-opacity-20 px-2 py-1 text-gray-500">
                          {service.users}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Blue Bottom Border */}
                {activeTab === service.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                )}
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="p-8 bg-white">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {services[activeTab].name}
              </h3>
              <p className="text-gray-600 mb-6">
                Get premium {services[activeTab].name.toLowerCase()} delivered instantly to boost your social media presence.
              </p>
              
              {/* Service Options */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Likes</h4>
                  <p className="text-sm text-gray-600 mt-1">Boost engagement</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Followers</h4>
                  <p className="text-sm text-gray-600 mt-1">Grow your audience</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Views</h4>
                  <p className="text-sm text-gray-600 mt-1">Increase visibility</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <div className="flex items-center justify-center mb-2">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="font-semibold text-gray-800">Comments</h4>
                  <p className="text-sm text-gray-600 mt-1">Drive interaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabbedInterface;