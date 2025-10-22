import Hero from "../components/commons/Hero"
// import PackagesSection from "../components/commons/PakagesSection"
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
import imageS from "../../public/images/s.png" // Assuming this is the image for the ImageSection
import img1 from "../Images/how1.png"
import img2 from "../Images/how2.png"
import img3 from "../Images/how3.png"

const BuyInstaComments = () => {
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
      <div className="primary-gradient">
        {/* <div className="custom-container py-20 space-y-10">
          <Hero
            heading={"Buy Instagram Comments with"}
            gradientHeading={"Instant Delivery"}
            greenText={"See our deals below!"}
            subHeading={
              "Buzzoid's revolutionary, customized technology lets you buy highly-relevant Instagram comments for your posts quickly, safely, and easily with just a few clicks."
            }
          />
        </div> */}
      </div>
      <PackagesSection platform="instagram" serviceType="comments" />
      <TestimonialSlider />
      <InfoSection
        title="Ready to buy"
        highlight="Instagram Comments?"
        subtitle="Instagram comments are the &quot;secret sauce&quot; that boosts audience and popularity. Buzzoid's unique, highly relevant IG comments, crafted with advanced technology that analyzes your posts for context and emotion, will send your organic growth soaring!"
        cards={infoCardsData}
      />
      <HowWork />
      <FAQSection
        renderIn="Comments"
        des={"Over 1,000 daily customers trust us as the best site for relevant Instagram comments"}
      />
      <ReviewSection />
      {/* <Guarante /> */}
      {/* <ComparisonSection /> */}
      <ImageSection
        heading="Why Buy Instagram Comments?"
        title="Boost Engagement and Interaction"
        des="Buying Instagram comments is a powerful way to increase engagement and make your posts more interactive. Comments signal genuine interest and can spark conversations, which Instagram's algorithm favors. This leads to higher visibility, attracting more organic reach and potential followers."
        image={imageS}
        imgPosition="right"
      />
    </>
  )
}

export default BuyInstaComments
