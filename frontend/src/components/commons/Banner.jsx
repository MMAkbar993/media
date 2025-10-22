import React from 'react';
import { Link } from "react-router-dom";
const Banner = () => {
  return (
    <div className="w-full bg-blue-600 relative overflow-hidden py-1 px-0">
      {/* Light blue geometric shape on the left */}
      {/* <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="w-16 h-12 bg-blue-300 transform rotate-12 opacity-80"></div>
      </div> */}

      {/* Main content container */}
      <div className="max-w-6xl mx-auto flex items-center justify-center relative z-10">
        {/* Text content */}
        <div className="flex text-center">
          <span className="text-white text-sm font-normal">Try out our new </span>
          <span className="text-white text-sm font-bold mx-1">Likes!</span>
        </div>

        {/* Button */}
        <div className="ml-8">
          <Link to="/instagram">
            <button className="bg-white text-blue-600 font-bold text-xs py-1 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 uppercase tracking-wide">
              Click Here
            </button>
          </Link>
        </div>
      </div>

      {/* Reddish-brown curved shape on the right */}
      {/* <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="w-12 h-12 bg-red-700 rounded-full opacity-80 transform scale-x-150 scale-y-75"></div>
      </div> */}
    </div>
  );
};

export default Banner;