import React from "react";

const steps = [
 {
    num: "1",
    img: "https://buzzoid.com/wp-content/themes/buzz/v3/public_profile-uGbtw58k.svg",
    alt: "Use public profile",
    title: "Use your public @username",
    text: "Be sure you have your profile set to 'public.' Otherwise, we can't deliver our services."
  },
  {
    num: "2",
    img: "https://buzzoid.com/wp-content/themes/buzz/v3/desired_package-U3Gx-Gy1.svg",
    alt: "Choose your desired package and confirm purchase",
    title: "Select a package",
    text: "We offer a range of select packages to best suit your engagement needs."
  },

   {
    num: "3",
    img: "https://buzzoid.com/wp-content/themes/buzz/v3/done-C2aTj84N.svg",
    alt: "That’s it!",
    title: "That’s it!",
    text: "After purchasing, sit back and relax. You can track current order status in real time!"
  },
 
  // {
  //   num: "4",
  //   img: "https://buzzoid.com/wp-content/themes/buzz/v3/create_account-DuCE26Yh.svg",
  //   alt: "Create account or checkout as guest",
  //   title: "Create account or checkout as guest",
  //   text: "Next, you can create a Buzzoid account if you’d like, or check out as a guest."
  // },
  // {
  //   num: "5",
  //   img: "https://buzzoid.com/wp-content/themes/buzz/v3/pay_securely-CGq61gtV.svg",
  //   alt: "Pay securely",
  //   title: "Pay securely",
  //   text: "Finally, you’ll be sent to our secure checkout page; available payment methods include debit or credit card, PayPal, and crypto."
  // },
 
  //  {
  //   num: "6",
  //   img: "https://buzzoid.com/wp-content/themes/buzz/v3/username-BGzxHx-P.svg",
  //   alt: "Enter username",
  //   title: "Enter username",
  //   text: "On the next page, enter your TikTok username so we can find your account, give us your email if you want us to send a receipt, and select the TikTok post to receive your likes."
  // },
];

const HowWork = () => {
  return (
    <div className="max-w-6xl mx-auto text-center mt-10 px-4 mb-12">
      <h2 className="text-3xl font-bold">
        How it <span className="text-blue-500">works</span>
      </h2>
      <p className="text-gray-600 max-w-3xl mx-auto mt-4">
        Our system makes it easy to search for your account, order, and deliver your engagement within minutes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {steps.map((step) => (
          <div
            key={step.num}
            className="bg-white rounded-lg border border-gray-200 p-6 text-left shadow-sm"
          >
            {/* Step number */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold">
                {step.num}
              </div>
              <svg
                width="25"
                height="12"
                viewBox="0 0 25 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.39458 6.45428L0.267456 2.46429L1.72983 0.95166L7.42158 6.45428L1.72983 11.9569L0.267458 10.4443L4.39458 6.45428Z"
                  fill="#FF5C00"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12.7885 6.45428L8.66138 2.46429L10.1237 0.95166L15.8155 6.45428L10.1238 11.9569L8.66138 10.4443L12.7885 6.45428Z"
                  fill="#FF5C00"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M21.1824 6.45428L17.0553 2.46429L18.5177 0.95166L24.2094 6.45428L18.5177 11.9569L17.0553 10.4443L21.1824 6.45428Z"
                  fill="#FF5C00"
                />
              </svg>
            </div>

            {/* Icon */}
            <img
              src={step.img}
              alt={step.alt}
              className="w-14 h-14 object-contain mb-4"
            />

            {/* Title */}
            <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

            {/* Text */}
            <p className="text-gray-600 text-sm">{step.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWork;
