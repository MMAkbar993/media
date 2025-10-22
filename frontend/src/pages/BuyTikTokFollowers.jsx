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
// import imageTick from "../../public/images/tick.png" // Assuming this is the image for the ImageSection
import img1 from "../Images/how1.png"
import img2 from "../Images/how2.png"
import img3 from "../Images/how3.png"

const BuyTikTokFollowers = () => {
 const infoCardsData = [
     {
       icon: img1,
       title: "Live Order Tracking",
       description: "See the progress of your order in real time.",
     },
     {
       icon: img2,
       title: "No Password Neededs",
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
            heading={"Buy TikTok Followers with"}
            gradientHeading={"Instant Delivery"}
            greenText={"Rated world's #1 TikTok growth service since 2012."}
            subHeading={
              "At Buzzoid, you can buy TikTok followers quickly, safely, and easily with just a few clicks. See our affordable prices and deals below!"
            }
          />
        </div>
      </div> */}
      <PackagesSection platform="tiktok" serviceType="followers" />
      {/* <Benefits /> */}
      <TestimonialSlider />
      <InfoSection
        title="Ready to buy"
        highlight="TikTok Followers?"
        subtitle="TikTok followers are the key to your success on the platform. Buzzoid's TikTok followers rapidly and safely boost engagement with your account, bringing in more viewers and making your posts more popular!"
        cards={infoCardsData}
      />
      <HowWork />
      <FAQsTikTok
        renderIn="Followers"
        des={"Over 1,000 daily customers trust us as the best site to deliver real TikTok followers"}
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
        heading="Why Buy TikTok Followers?"
        title="Boost Your TikTok Presence"
        des="Buying TikTok followers is a strategic move to enhance your profile's credibility and reach. A higher follower count makes your content more appealing to new viewers, increasing organic discovery and engagement. It's an effective way to accelerate your growth on the platform."
        image={imageTick}
        imgPosition="left"
      /> */}
    </>
  )
}

export default BuyTikTokFollowers
