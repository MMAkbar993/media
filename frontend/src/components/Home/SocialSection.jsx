import { ImageSection } from "../commons";

const SocialSection = () => {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="custom-container space-y-16 py-20">
        <ImageSection
          heading={"Social Media Visibility"}
          title={"Instagram and TikTok have become so popular worldwide that it's almost impossible for users to earn widespread visibility and interaction with the content that they create."}
          des={"But when users see accounts and posts with large numbers of followers, views, likes, and comments, they're likely to stop and see what the fuss is about."}
          imgPosition="right"
          image="images/s.png"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
        />
        <ImageSection
          heading={"Accelerated Profile Growth"}
          title={"That gets more and more people engaged with your Instagram and TikTok pages, making you more popular, more influential, and more important on the apps."}
          des={"Buzzoid can make it happen! Our IG or TikTok engagement packages arrive immediately, your account stays safe, and you see fast organic growth for your profile, pages, and posts!"}
          imgPosition="left"
          image="images/a.png"
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow duration-300"
        />
      </div>
    </div>
  );
};

export default SocialSection;