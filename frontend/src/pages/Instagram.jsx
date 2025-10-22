import React, { useState } from 'react';
import { Heart, Users, Eye, MessageCircle } from 'lucide-react';
import { Link } from "react-router-dom";

import BuyInstaLikes from './BuyInstaLikes';
import BuyInstaFollowers from './BuyInstaFollowers';
import BuyInstaViews from './BuyInstaViews';
import BuyInstaComments from './BuyInstaComments';
import ProtectionToggle from '../components/commons/ProtectionToggle';

const Instagram = () => {
  const [activeTab, setActiveTab] = useState('likes');

  const tabs = [
    { id: 'likes', label: 'Likes', icon: Heart },
    { id: 'followers', label: 'Followers', icon: Users },
    { id: 'views', label: 'Views', icon: Eye },
    // { id: 'comments', label: 'Comments', icon: MessageCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'likes':
        return <BuyInstaLikes />;
      case 'followers':
        return <BuyInstaFollowers />;
      case 'views':
        return <BuyInstaViews />;
      case 'comments':
        return <BuyInstaComments />;
      default:
        return <BuyInstaLikes />;
    }
  };

  const StarIcon = () => (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1.13889 5.66053C0.705409 5.22261 0.956153 4.47778 1.56621 4.39118L4.3102 4.00163C4.55596 3.96674 4.76851 3.81244 4.8778 3.58956L6.10512 1.08674C6.38135 0.523439 7.18608 0.528536 7.45515 1.09529L8.65196 3.61619C8.75836 3.84032 8.96879 3.99727 9.21396 4.03536L11.9523 4.46081C12.5612 4.55542 12.8021 5.30355 12.3628 5.73572L10.3475 7.71845C10.1745 7.88865 10.0946 8.13208 10.1331 8.3717L10.5845 11.1794C10.6834 11.7945 10.0323 12.2547 9.48544 11.9563L7.07414 10.6402C6.85338 10.5197 6.5869 10.518 6.36458 10.6356L3.93775 11.9194C3.38697 12.2108 2.74182 11.7419 2.84891 11.1281L3.33717 8.32956C3.37889 8.09046 3.30224 7.84595 3.13148 7.67346L1.13889 5.66053Z" fill="#38C793" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Title - Mobile Only */}
        <div className="block sm:hidden mb-4">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Instagram Services</h1>
        </div>

        {/* Tab Navigation */}
        {/* Advanced Tabbed Interface */}
        {/*  */}
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 mb-4 sm:mb-6 w-full max-w-md mx-auto">
          <ProtectionToggle />
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-6 w-full max-w-md mx-auto">
          {/* Desktop/Tablet Horizontal Tabs */}
          {/* <ProtectionToggle /> */}
          <div className="hidden sm:flex">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 px-3 lg:px-6 text-sm font-medium transition-all duration-200 ${index === 0 ? 'rounded-l-xl' : ''
                    } ${index === tabs.length - 1 ? 'rounded-r-xl' : ''
                    } ${activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent
                    className={`w-4 h-4 lg:w-5 lg:h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`}
                  />
                  <span className="text-xs lg:text-sm whitespace-nowrap">{tab.label}</span>
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
                      ? 'text-blue-600 border-l-4 border-blue-600 bg-blue-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Tab Grid Alternative - Optional */}
        <div className="hidden xs:grid xs:grid-cols-2 sm:hidden gap-2 mb-4 max-w-md mx-auto">
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50 border-2 border-blue-200'
                  : 'text-gray-500 bg-white border-2 border-gray-200 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <IconComponent
                  className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`}
                />
                <span className="text-xs">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="w-full">
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4 lg:p-6">
            {renderContent()}
          </div>
        </div>

        {/* Active Tab Indicator for Mobile */}
        <div className="block sm:hidden mt-4">
          <div className="text-center text-sm text-gray-500">
            Currently viewing: <span className="font-semibold text-blue-600">{tabs.find(tab => tab.id === activeTab)?.label}</span>
          </div>
        </div>

        {/* Optional: Quick Stats or Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-sm text-gray-600">Customer Support</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">100%</div>
            <div className="text-sm text-gray-600">Safe & Secure</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-blue-600">Fast</div>
            <div className="text-sm text-gray-600">Instant Delivery</div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Instagram;