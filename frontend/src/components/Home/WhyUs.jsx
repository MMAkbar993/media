import { ImageSection } from "../commons";

const WhyUs = ({ name, description }) => {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50">
      <div className="custom-container space-y-24 py-24">
        {/* Header Section */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900">
            Why{" "}
            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              {name || "CompanyName"}
            </span>
          </h2>
          <div className="w-full max-w-4xl mx-auto">
            <p className="text-center text-gray-600 font-medium text-xl leading-relaxed">
              {description || 
                "We're not the only provider offering Instagram interactions for sale. We're the best, though, and we want you to feel comfortable trying our services."}
            </p>
          </div>
        </div>

        {/* Content Cards */}
        <div className="space-y-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-10 hover:shadow-xl transition-all duration-500">
            <ImageSection
              heading={"Industry-Leading Services"}
              title={
                "CompanyName has been delivering high-quality, real Instagram followers, likes, and video views for more than a dozen years, and we've been the top-ranked Instagram service provider ever since. We've also been featured as a trusted IG service in publications like Men's Journal, US Weekly, and 303 Magazine."
              }
              des={
                "When TikTok was first open for American and European signups, we added TikTok services to our menu almost immediately and rapidly became the highest-rated TikTok provider as well."
              }
              imgPosition="right"
              image="images/b.png"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 p-10 hover:shadow-xl transition-all duration-500">
            <ImageSection
              heading={"Trusted Growth Experts"}
              title={
                "Since we began operations, we've helped countless users grow their social media presence across platforms, delivering billions of Instagram interactions and hundreds of thousands of TikTok engagements. Our diverse community includes individual content creators and everyday users looking to expand their reach and connect with others who share their interests."
              }
              des={
                "They all trust CompanyName because we deliver the best results available from any social media service provider. That's all thanks to our expert and experienced staff, who understand the fastest and most effective ways to generate organic account growth, safely and according to all apps' terms and conditions."
              }
              imgPosition="left"
              image="images/d.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUs;