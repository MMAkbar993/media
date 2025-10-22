import { Star, Check } from "lucide-react"

const Hero = ({ heading, gradientHeading, subHeading, greenText }) => {
  return (
    <div className="center flex-col space-y-10 bg-gradient py-12">
      <p className="heading text-center leading-14">
        {heading}{" "}
        <span className="bg-gradient-to-r from-[#005CD9] to-[#FF55F8] bg-clip-text text-transparent">
          {gradientHeading}
        </span>
        <span role="img" aria-label="rocket">
          🚀
        </span>
      </p>
      <p className="text-secondary-text-color font-medium text-center text-lg sm:max-w-2xl">
        {subHeading} <span className="text-green-500">{greenText}</span>
      </p>
      <div className="w-full sm:flex-row flex-col sm:max-w-2xl gap-6 space-between">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className="bg-[#00d084] w-fit px-1 rounded">
              <Star className="text-sm text-white" fill="currentColor" size={16} />
            </div>
          ))}
        </div>
        <div className="h-8 w-[1px] bg-gray-300" />
        <div className="bg-[#00d084]/10 space-between gap-1 px-4 py-5 rounded-2xl text-sm flex-1">
          <div className="align-center gap-2">
            <div className="relative">
              <div className="bg-[#00d084] w-2.5 h-2.5 animate-ping rounded-full absolute" />
              <div className="bg-[#00d084] w-2.5 h-2.5 rounded-full z-10" />
            </div>
            <p className="text-[#065f46]">
              <span className="font-medium">100 followers</span> delivered
            </p>
          </div>
          <div className="align-center gap-2">
            <div className="bg-white center w-6 h-6 rounded-full">
              <Check className="text-[#00d084]" size={16} />
            </div>
            <p className="text-[#065f46]">43 minutes ago</p>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-gray-300" />
        {/* Apple Pay Button */}
          <div className="text-primary-text-color border border-gray-300 px-4 py-2 rounded-lg text-xl flex items-center gap-2">
            <i className="fa-brands fa-apple"></i>
            <p>Pay</p>
          </div>
      </div>
    </div>
  )
}

export default Hero
