"use client"
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
// import imageA from "../../public/images/a.png"
import img1 from "../Images/how1.png"
import img2 from "../Images/how2.png"
import img3 from "../Images/how3.png"

const BuyInstaLikes = () => {
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
            heading={"Buy Instagram Likes with"}
            gradientHeading={"Instant Delivery"}
            greenText={"Rated best site for Instagram growth!"}
            subHeading={
              "Buzzoid's Instagram likes rapidly and safely boost engagement with your account, bringing in more viewers and making your posts more popular!"
            }
          />
        </div>
      </div> */}

      <PackagesSection platform="instagram" serviceType="likes" />

      <TestimonialSlider />

      <InfoSection
        title="Ready to buy"
        highlight="Instagram Likes?"
        subtitle="Buying likes for your Instagram posts is the best way to gain more engagement and success. Improve your social media marketing strategy with us."
        cards={infoCardsData}
      />

      <HowWork />

      <FAQSection
        renderIn="Likes"
        des={"Over 1,000 daily customers trust us as the best site to deliver real Instagram likes"}
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
        heading="Why Buy Instagram Likes?"
        title="Boost Your Engagement and Reach"
        des="Buying Instagram likes can significantly increase your post's visibility and credibility. More likes signal to the Instagram algorithm that your content is popular, leading to higher organic reach and attracting more genuine followers. It's a quick and effective way to kickstart your growth."
        image={imageA}
        imgPosition="left"
      /> */}
    </>
  )
}

export default BuyInstaLikes
