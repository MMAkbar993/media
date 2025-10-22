import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const InfoCard = ({ title, content, image, compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg py-6 px-4 transition-all duration-300 border border-gray-100">
        {/* Compact Image */}
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-16 h-16 object-contain mx-auto rounded-xl mb-3"
          />
        ) : (
          <div className="w-16 h-16 bg-gray-200 mx-auto rounded-xl flex items-center justify-center text-gray-500 mb-3">
            <span className="text-xs">No Image</span>
          </div>
        )}

        <h3 className="font-semibold text-sm mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600 text-xs leading-relaxed">{content}</p>
      </div>
    );
  }

  return (
    <div
      className={`${
        expanded ? "max-h-full" : "max-h-[67vh] overflow-hidden relative"
      } relative space-y-6 text-center rounded-xl shadow-md hover:shadow-sm py-12 px-6 max-w-xs w-full transition-all duration-300 bg-white border border-gray-100`}
    >
      {/* Image slot - replacing the black square */}
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-24 h-24 object-contain mx-auto rounded-2xl mb-4"
        />
      ) : (
        // Fallback or placeholder if no image is provided
        <div className="w-24 h-24 bg-gray-200 mx-auto rounded-2xl flex items-center justify-center text-gray-500 mb-4">
          No Image
        </div>
      )}

      <h3 className="font-semibold text-md mb-2">{title}</h3>
      <div className={`text-gray-600 transition-all text-sm duration-300 `}>
        <p>{content}</p>
        {!expanded && (
          // This gradient is crucial for masking the content before expanding
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>
      {/* Button position adjusted slightly to ensure it's always clickable below gradient */}
      <div className="flex justify-center mt-4 absolute bottom-2 left-1/2 -translate-x-1/2">
        <button
          className="text-gray-500 bg-white p-1 rounded-full shadow cursor-pointer"
          onClick={() => setExpanded(!expanded)}
          aria-label="Toggle More"
        >
          {expanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </button>
      </div>
    </div>
  );
};

export default InfoCard;
