import Hero from "../components/commons/Hero"
import PackagesSection from "../components/commons/PakagesSection"
import InfoSection from "../components/commons/InfoSection"
import HowWork from "../components/commons/HowWork"
import FAQsTikTok from "../components/commons/FAQsTikTok"
import ReviewSection from "../components/commons/ReviewSection"
import TestimonialSlider from "../components/commons/Testinomals"
import Guarante from "../components/commons/Guarante"
import ComparisonSection from "../components/commons/ComparisonSection"
import ImageSection from "../components/commons/ImageSection"
import Benefits from "../components/Individual/TikTok/Benefits"

// import icon1 from "../Images/clock.png"
// import icon2 from "../Images/like.png"
// import icon3 from "../Images/call.png"
// import imageTick from "../../public/images/tick.png" // Reusing for consistency, replace if specific image exists
import img1 from "../Images/how1.png"
import img2 from "../Images/how2.png"
import img3 from "../Images/how3.png"

const BuyTikTokLikes = () => {
 const infoCardsData = [
     {
       icon: img1,
       title: "Live Order Tracking",
       description: "See the progress of your order in real time.",
     },
     {
       icon: img2,
       title: "No Password Needed",
       description: "All we need is your profile to be public. We'll deliver within minutes",
     },
     {
       icon: img3,
       title: "24/7 Customer Support",
       description: "We've got your back. Your satisfaction is our priority.",
     },
   ]

  return (
    <>
      {/* <div className="primary-gradient">
        <div className="custom-container py-20 space-y-10">
          <Hero
            heading={"Buy TikTok Likes with"}
            gradientHeading={"Instant Delivery"}
            greenText={"Rated world's #1 TikTok growth service since 2012."}
            subHeading={
              "At Buzzoid, you can buy TikTok likes quickly, safely, and easily with just a few clicks. See our affordable prices and deals below!"
            }
          />
        </div>
      </div> */}
      <PackagesSection platform="tiktok" serviceType="likes" />
      <TestimonialSlider />
      {/* <Benefits /> */}
    
      <InfoSection
        title="Ready to buy"
        highlight="TikTok Likes?"
        subtitle="Buying likes for your TikTok posts is the best way to gain more engagement and success. Improve your social media marketing strategy with Buzzoid."
        cards={infoCardsData}
      />
      <HowWork />
      <FAQsTikTok
        renderIn="Likes"
        des={"Over 1,000 daily customers trust us as the best site to deliver real TikTok likes"}
      />
      <ReviewSection />
       <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">We have proudly delivered over</h2>
          <p className="text-5xl font-extrabold text-blue-600 mb-8">9,840,561 likes</p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied customers who have boosted their social media presence with our reliable and
            high-quality services.
          </p>
        </div>
      </section>
      {/* <Guarante />
      <ComparisonSection />
      <ImageSection
        heading="Why Buy TikTok Likes?"
        title="Boost Your Video's Popularity"
        des="Buying TikTok likes is essential for increasing your video's engagement and visibility. More likes signal to the TikTok algorithm that your content is popular, leading to higher organic reach and attracting more viewers. It's a fast and effective way to make your videos go viral."
        image={imageTick}
        imgPosition="right"
      /> */}
    </>
  )
}

export default BuyTikTokLikes
