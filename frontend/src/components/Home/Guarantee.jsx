const Guarantee = ({ origin }) => {
  let data = [
    {
      title: "Instant Delivery",
      des: "Our services are delivered within minutes of purchasing for quick growth across your accounts. We even support real time order tracking",
    image: "images/sea.svg",
    },
    {
      title: "Graded Security",
      des: "Privacy is key. All orders are privately handled and your payment is securely processed through Stripe.",
      image: "images/tick.png",   
    },
    {
      title: "Top Rated Warranty",
      des: "All orders are backed by a 14 day warranty and covered under our money back guarantee.",
    image: "images/call.png",
    },
  ];
  data = origin === "tiktokviews" ? data.slice(0, 1) : data;
  return (
    <div className="custom-container space-y-20 py-20">
      <div className="space-y-5">
        {origin !== "tiktokviews" && (
          <>
            <p className="heading text-center">Our Guarantees</p>
            <div className="w-full max-w-3xl mx-auto">
              <p className="text-center text-primary-text-color font-medium text-lg">
                We pride ourselves on quality, security, and service.
              </p>
            </div>
          </>
        )}
      </div>
      <div className={`grid grid-cols-1 sm:grid-cols-3 align-center items-stretch gap-5`}>
   {data.map((item, index) => {
  return (
    <div
      key={index}
      className={`px-5 py-10 space-y-5 rounded-3xl shadow-md transition-all duration-300 ease-in-out hover:shadow-none bg-white border border-gray-200 cursor-pointer bg-red-400 ${
        origin === "tiktokviews" ? "w-1/3 w-full mx-auto" : "flex-1"
      }`}
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-16 h-16 mx-auto object-contain rounded-2xl"
      />
      <h6 className="text-center font-semibold text-primary-text-color">
        {item.title}
      </h6>
      <p className="text-center text-secondary-text-color text-[0.95rem]">
        {item.des}
      </p>
    </div>
  );
})}

      </div>
      {origin == "tiktokviews" && (
        <p className="text-2xl text-center w-9/12 font-medium mx-auto">
          Those are just some of the reasons that likes matter to TikTok users.
          No matter why they want to boost their engagement, audience, and
          follower bases, though, they’ve all found that our high-quality
          services{" "}
          <span className="text-gradient">
            make Buzzoid the best site for buying TikTok likes and other
            interactions.
          </span>
        </p>
      )}
    </div>
  );
};

export default Guarantee;
