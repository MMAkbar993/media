const PackageCard = ({ label, discount, highlight, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative w-full border rounded-xl text-center py-3 px-2 sm:py-4 sm:px-6 cursor-pointer transition-all min-h-[80px] sm:min-h-[100px] flex flex-col justify-center
        ${selected ? "border-pink-500 shadow-md" : "border-gray-200 hover:border-pink-400"}
      `}
    >
      {highlight && (
        <span
          className={`
            absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 sm:px-2 rounded-full text-white whitespace-nowrap z-10
            ${highlight === "BEST SELLING" ? "bg-green-500" : "bg-black"}
          `}
        >
          {highlight}
        </span>
      )}
      <p className="text-sm sm:text-base lg:text-lg font-semibold break-words leading-tight">
        {label}
      </p>
      {discount && (
        <p className="text-[10px] sm:text-xs text-orange-500 mt-1 break-words">
          {discount}
        </p>
      )}
    </div>
  )
}

export default PackageCard