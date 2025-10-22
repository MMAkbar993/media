import React from 'react';

const NewCommentsBanner = () => {
  return (
    <div className="w-full bg-blue-600 relative overflow-hidden py-6 px-4">
      {/* Light blue geometric shape on the left */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="w-16 h-12 bg-blue-300 transform rotate-12 opacity-80"></div>
      </div>
      
      {/* Main content container */}
      <div className="max-w-6xl mx-auto flex items-center justify-between relative z-10">
        {/* Text content */}
        <div className="flex-1 text-center">
          <span className="text-white text-lg font-normal">Try out our new </span>
          <span className="text-white text-lg font-bold">Comments!</span>
        </div>
        
        {/* Button */}
        <div className="ml-8">
          <button className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200 uppercase tracking-wide">
            Click Here
          </button>
        </div>
      </div>
      
      {/* Reddish-brown curved shape on the right */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-12 h-12 bg-red-700 rounded-full opacity-80 transform scale-x-150 scale-y-75"></div>
      </div>
    </div>
  );
};

export default NewCommentsBanner; 