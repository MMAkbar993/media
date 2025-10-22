import React, { useState } from 'react';
import { Heart, Users, Eye } from 'lucide-react';
import BuyTikTokLikes from './BuyTikTokLikes';
import BuyTikTokFollowers from './BuyTikTokFollowers';
import BuyTikTokViews from './BuyTikTokViews';
import ProtectionToggle from '../components/commons/ProtectionToggle';

// TikTok Page Component
const Tiktok = () => {
  const [activeTab, setActiveTab] = useState('likes');

  const tabs = [
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'followers', label: 'Followers', icon: Users },
    { id: 'views', label: 'Views', icon: Eye },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'likes':
        return <BuyTikTokLikes />;
      case 'followers':
        return <BuyTikTokFollowers />;
      case 'views':
        return <BuyTikTokViews />;
      default:
        return <BuyTikTokLikes />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Title - Mobile Only */}
        <div className="block sm:hidden mb-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">TikTok Services</h1>
        </div>

        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 mb-4 sm:mb-6 w-full max-w-md mx-auto">
          <ProtectionToggle />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 w-full max-w-md mx-auto">
          {/* Desktop/Tablet Horizontal Tabs */}
          <div className="hidden sm:flex">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-4 lg:px-6 text-sm font-medium transition-all duration-200 first:rounded-l-xl last:rounded-r-xl ${activeTab === tab.id
                      ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${activeTab === tab.id ? 'text-pink-600' : 'text-gray-400'
                      }`}
                  />
                  <span className="text-xs lg:text-sm">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Vertical Tabs */}
          <div className="flex flex-col sm:hidden">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-4 px-4 text-sm font-medium transition-all duration-200 ${index === 0 ? 'rounded-t-xl' : ''
                    } ${index === tabs.length - 1 ? 'rounded-b-xl' : 'border-b border-gray-100'
                    } ${activeTab === tab.id
                      ? 'text-pink-600 border-l-4 border-pink-600 bg-pink-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${activeTab === tab.id ? 'text-pink-600' : 'text-gray-400'
                      }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </div>
        </div>

        {/* Optional: Active Tab Indicator for Mobile */}
        <div className="block sm:hidden mt-4">
          <div className="text-center text-sm text-gray-500">
            Currently viewing: <span className="font-semibold text-pink-600">{tabs.find(tab => tab.id === activeTab)?.label}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tiktok;