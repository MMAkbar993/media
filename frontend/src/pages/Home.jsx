import Buy from "../components/commons/Buy"
import Hero from "../components/Home/Hero"
import SocialSection from "../components/Home/SocialSection"
import WhyUs from "../components/Home/WhyUs"
import GetStarted from "../components/Home/GetStarted"
import Guarantee from "../components/Home/Guarantee"
import { Carousel } from "../components/Individual"
import NewCommentsBanner from "../components/commons/NewCommentsBanner"
import ScrollingMarquee from "../components/Home/ScrollingMarquee"
import ClientReviewSlider from "../components/commons/ClientReviewSlider"

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      {/* <NewCommentsBanner /> */}

      <ScrollingMarquee />
      {/* Client Reviews Section */}
      {/* <ClientReviewSlider /> */}
      {/* Services Introduction */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="custom-container">
          <div className="text-center space-y-6">
            <h2 className="heading text-center sm:text-3xl text-2xl">
              <span className="text-gradient">Premium Engagement Packages</span>
            </h2>
            <p className="text-lg text-[#484f5e] font-medium w-full max-w-4xl text-center mx-auto leading-relaxed">
              Deliver rapid growth to your accounts with our user-friendly and secure platform. We deliver controlled engagement with our top-rated packages in just a few clicks at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Services Carousel */}
      <section className="py-12 bg-gray-50">
        <Carousel autoPlay={true} interval={6000}>
          {/* Instagram Followers */}
          <Buy
            title="Buy Instagram Followers"
            description="A high follower count is the number one sign that an Instagram user is popular and influential. This section delves into the various benefits and reasons why increasing your follower count is crucial for social media success."
            subtitle="Key Reasons to Buy Instagram Followers"
            features={[
              "Premium Packages",
              "Unparalleled results",
              "Safe and secure ordering",

            ]}
            cta={"BUY INSTAGRAM FOLLOWERS"}
            bg={"bg-gradient-to-b from-[#e0f2ff] to-white"}
            cardsFirst={false}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}

            card2Image={"/images/2c.svg"}
            platform="instagram"
            serviceType="followers"
            link="/instagram"
          />

          {/* Instagram Likes */}
          <Buy
            title="Buy Instagram Likes"
            description="Likes are the currency of social media engagement, indicating how much your content resonates with your audience. Discover why buying likes can significantly boost your post visibility and credibility."
            subtitle="Advantages of Purchasing Instagram Likes"
            features={[
              "Affordable Prices",
              "Immediate Delivery in Minutes",
              "Fast Growth",
            ]}
            cta={"BUY INSTAGRAM LIKES"}
            bg={"bg-gradient-to-b from-[#fff0e5] to-white"}
            cardsFirst={true}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="instagram"
            serviceType="likes"
            link="/instagram"
          />

          {/* Instagram Views */}
          <Buy
            title="Buy Instagram Views"
            description="For video content, views are paramount. A high view count suggests popularity and relevance, drawing more attention to your reels, stories, and IGTV videos. Learn how to maximize your video impact."
            subtitle="Why Views Matter for Your Instagram Videos"
            features={[
              "Exclusive Service",
              "Fast Delivery",
              "Packages up to 50,000",
              
            ]}
            cta={"BUY INSTAGRAM VIEWS"}
            bg={"bg-gradient-to-b from-[#eff0fc] to-white"}
            cardsFirst={false}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="instagram"
            serviceType="views"
            link="/instagram"
          />

          {/* Instagram Comments */}
          {/* <Buy
            title="Buy Instagram Comments"
            description="Comments foster genuine interaction and indicate a highly engaged audience. They are a powerful metric for the algorithm and signal authentic connection. Discover how comments can transform your presence."
            subtitle="The Value of Real Instagram Comments"
            features={[
              "100% legitimate comments that keep your account safe",
              "Premium and VIP comment upgrades available",
              "Packages of 10-200,000 real comments available",

            ]}
            cta={"BUY INSTAGRAM COMMENTS"}
            bg={"bg-gradient-to-b from-[#f2e5ff] to-white"}
            cardsFirst={true}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="instagram"
            serviceType="comments"
            link="/instagram"
          /> */}

          {/* TikTok Followers */}
          <Buy
            title="Buy Tiktok Followers"
            description="Just like on Instagram, a robust follower count on TikTok is a fundamental indicator of influence and popularity. Attract more organic followers by showcasing your existing social proof."
            subtitle="Boosting Your TikTok Presence with Followers"
            features={[
              "Premium Packages",
              "Unparalleled results",
              "Safe and secure ordering",

            ]}
            cta={"BUY TIKTOK FOLLOWERS"}
            bg={"bg-gradient-to-b from-[#e0f2ff] to-white"}
            cardsFirst={false}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="tiktok"
            serviceType="followers"
            link="/tiktok"
          />

          {/* TikTok Likes */}
          <Buy
            title="Buy Tiktok Likes"
            description="Likes on TikTok are crucial for video visibility and viral potential. They tell the algorithm that your content is engaging and worth sharing, propelling your videos to a wider audience."
            subtitle="Why TikTok Likes Drive Engagement"
            features={[
              "Affordable Prices",
              "Immediate Delivery in Minutes",
              "Fast Growth",
            ]}
            cta={"BUY TIKTOK LIKES"}
            bg={"bg-gradient-to-b from-[#fff0e5] to-white"}
            cardsFirst={true}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="tiktok"
            serviceType="likes"
            link="/tiktok"
          />

          {/* TikTok Views */}
          <Buy
            title="Buy Tiktok Views"
            description="Views are the most direct measure of your video's reach on TikTok. A high view count enhances credibility and encourages more users to watch, making your content stand out in a crowded feed."
            subtitle="Boosting Your Video Reach with TikTok Views"
           features={[
              "Exclusive Service",
              "Fast Delivery",
              "Packages up to 50,000",
              
            ]}
            cta={"BUY TIKTOK VIEWS"}
            bg={"bg-gradient-to-b from-[#eff0fc] to-white"}
            cardsFirst={false}
            card1Title={"Superior Reach"}

            card1Image={"/images/1c.svg"}
            card2Title={"Trusted Boost"}
            card2Image={"/images/2c.svg"}
            platform="tiktok"
            serviceType="views"
            link="/tiktok"
          />
        </Carousel>
      </section>

      {/* Social Section */}
      {/* <section className="py-16 bg-white">
        <SocialSection />
      </section> */}

      {/* Why Us Section */}
      {/* <section className="py-16 bg-gray-50">
        <WhyUs />
      </section> */}

      {/* Get Started Section */}
      <section className="py-16 bg-white">
        <GetStarted />
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <Guarantee />
      </section>
    </div>
  )
}

export default Home
