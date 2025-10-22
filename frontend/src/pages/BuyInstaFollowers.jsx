import Hero from "../components/commons/Hero"
import PackagesSection from "../components/commons/PakagesSection"
import InfoSection from "../components/commons/InfoSection"
import HowWork from "../components/commons/HowWork"
import FAQSection from "../components/commons/FAQs"
import ReviewSection from "../components/commons/ReviewSection"
import TestimonialSlider from "../components/commons/Testinomals"
import Guarante from "../components/commons/Guarante"
import ComparisonSection from "../components/commons/ComparisonSection"
import ImageSection from "../components/commons/ImageSection"

// import icon1 from "../Images/clock.png"
// import icon2 from "../Images/like.png"
// import icon3 from "../Images/call.png"
// import imageB from "../../public/images/b.png" // Assuming this is the image for the ImageSection
import img1 from "../Images/how1.png"
import img2 from "../Images/how2.png"
import img3 from "../Images/how3.png"

const BuyInstaFollowers = () => {
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
        <div className="custom-container">
          <Hero
            heading={"Buy Instagram Followers with"}
            gradientHeading={"Instant Delivery"}
            greenText={"Rated best site for Instagram growth!"}
            subHeading={
              "Buzzoid's Instagram followers rapidly and safely boost engagement with your account, bringing in more viewers and making your posts more popular!"
            }
          />
        </div>
      </div> */}
      <PackagesSection platform="instagram" serviceType="followers" />
      <TestimonialSlider />
      <InfoSection
        title="Ready to buy"
        highlight="Instagram Followers?"
        subtitle="Buying followers for your Instagram profile is the best way to gain more engagement and success. Improve your social media marketing strategy with Buzzoid."
        cards={infoCardsData}
      />
      <HowWork />
      <FAQSection
        renderIn="Followers"
        des={"Over 1,000 daily customers trust us as the best site to deliver real Instagram followers"}
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
      {/* <Guarante /> */}
      {/* <ComparisonSection /> */}
      {/* <ImageSection
        heading="Why Buy Instagram Followers?"
        title="Expand Your Reach and Influence"
        des="Purchasing Instagram followers can significantly expand your audience and influence. A higher follower count makes your profile appear more credible and attractive, encouraging organic growth and increasing your content's visibility. It's a strategic move to accelerate your social media presence."
        image={imageB}
        imgPosition="right"
      /> */}
    </>
  )
}

export default BuyInstaFollowers
