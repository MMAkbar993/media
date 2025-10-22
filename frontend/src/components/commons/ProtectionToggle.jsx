import React, { useState } from "react";

const ProtectionToggle = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        onClick={() => setEnabled(!enabled)}
        className={`
          relative flex items-center gap-3 px-5 py-3 rounded-full w-full max-w-md
          transition-all duration-300
          ${enabled ? "bg-green-500 shadow-lg" : "bg-white"}
        `}
        style={{
          border: "2px solid transparent",
          backgroundImage: enabled
            ? "linear-gradient(#22c55e, #22c55e)" // solid green
            : "linear-gradient(white, white), linear-gradient(90deg, #ec008c, #ff9a00, #ec008c)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          animation: enabled ? "" : "gradientMove 3s linear infinite",
        }}
      >
        {/* Toggle circle */}
        <div
          className={`w-6 h-6 rounded-full flex-shrink-0 border transition-all duration-300 ${
            enabled ? "bg-white border-green-600" : "bg-gray-300 border-gray-400"
          }`}
        >
          {enabled && <div className="w-6 h-6 rounded-full bg-green-600" />}
        </div>

        {/* Label (always visible) */}
        <span
          className={`font-medium transition-colors ${
            enabled ? "text-white" : "text-gray-800"
          }`}
        >
          I want 90 day protection
        </span>
      </button>

      {/* Add-on price note */}
      <p className="text-sm text-gray-500 ml-3">+$20 add-on to the order</p>

      {/* Gradient keyframes */}
      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default ProtectionToggle;
