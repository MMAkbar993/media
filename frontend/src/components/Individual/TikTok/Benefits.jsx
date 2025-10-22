import icon1 from "../../../Images/clock.png";
import icon2 from "../../../Images/like.png";
import icon3 from "../../../Images/call.png";
import InfoSection from "../../commons/InfoSection";
const cardsData = [
  {
    icon: icon1,
    title: "1. Instant Delivery Guaranteed",
    description:
      "Don’t wait to get your views. We send instant views from real people.",
  },
  {
    icon: icon2,
    title: "2. Real, Organic Followers",
    description:
      "Buying Instagram followers doesn't have to be hard! We only deliver 100% organic followers.",
  },
  {
    icon: icon3,
    title: "3. 24/7 Customer Support",
    description:
      "Nothing worse than dealing with bad customer support. We got your back.",
  },
];
const cardsData1 = [
  {
    icon: icon1,
    title: "1. Instant Delivery Guaranteed",
    description:
      "Don’t wait to get your views. We send instant views from real people.",
  },
  {
    icon: icon2,
    title: "2. Real, Organic Followers",
    description:
      "Buying Instagram followers doesn't have to be hard! We only deliver 100% organic followers.",
  },
  {
    icon: icon3,
    title: "3. 24/7 Customer Support",
    description:
      "Nothing worse than dealing with bad customer support. We got your back.",
  },
  {
    icon: icon1,
    title: "1. Instant Delivery Guaranteed",
    description:
      "Don’t wait to get your views. We send instant views from real people.",
  },
  {
    icon: icon3,
    title: "3. 24/7 Customer Support",
    description:
      "Nothing worse than dealing with bad customer support. We got your back.",
  },
  {
    icon: icon1,
    title: "1. Instant Delivery Guaranteed",
    description:
      "Don’t wait to get your views. We send instant views from real people.",
  },
];
const features = [
  "Authentic followers",
  "High quality followers",
  { text: "Orders start in 60 seconds", highlight: true },
  { text: "No password required", highlight: true },
  { text: "Fast Delivery (instant)", highlight: true },
  "24/7 live support",
];
const Benefits = () => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-center  p-4">
          <div className="max-w-sm w-full bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-[#2A2D3C] text-white p-6 rounded-t-xl">
              <h3 className="text-xl font-semibold leading-tight">
                High Quality <br /> Followers
              </h3>
            </div>

            {/* Features List */}
            <div className="p-3">
              <ul className="space-y-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <svg
                      className="w-3 h-3 text-purple-600 mr-3 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span className={feature.highlight ? "text-xs font-bold" : ""}>
                      {typeof feature === "object" ? (
                        <>
                          {feature.text.split(" ").map((word, i) => (
                            <span
                              key={i}
                              className={
                                [
                                  "60",
                                  "seconds",
                                  "No",
                                  "password",
                                  "required",
                                  "Fast",
                                  "Delivery",
                                  "(instant)",
                                ].includes(word)
                                  ? "font-bold"
                                  : ""
                              }
                            >
                              {word}{" "}
                            </span>
                          ))}
                        </>
                      ) : (
                        feature
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="custom-container">
        <InfoSection
          fromInsta={false}
          title="Why choose"
          highlight="Buzziod?"
          subtitle=""
          cards={cardsData1.slice(0, 5)}
        />
        <InfoSection
          title="How it "
          highlight="works?"
          subtitle="Once the app was available in the US and Europe, TikTok quickly became one of the best sites to see and be seen. The social media platform was first known for its younger demographics, but now almost two billion active users create more than 30 million TikTok videos every day. That makes it an enormous challenge for average TikTok users to have their posts seen by many viewers; the TikTok algorithms give the biggest audiences to the most popular accounts. Purchasing one of our packages of real fans gives you the advantage you need."
          cards={cardsData1}
        />
        <InfoSection
          fromInsta={false}
          title="Benefits of buying"
          highlight="TikTok Followers?"
          subtitle="Once the app was available in the US and Europe, TikTok quickly became one of the best sites to see and be seen. The social media platform was first known for its younger demographics, but now almost two billion active users create more than 30 million TikTok videos every day. That makes it an enormous challenge for average TikTok users to have their posts seen by many viewers; the TikTok algorithms give the biggest audiences to the most popular accounts. Purchasing one of our packages of real fans gives you the advantage you need."
          cards={cardsData}
        />
        <div className="text-3xl font-semibold center flex-col">
          <p>We have proudly delivered over</p>
          <p className="text-gradient">8,803,553,231 views</p>
        </div>
      </div>
    </div>
  );
};

export default Benefits;
