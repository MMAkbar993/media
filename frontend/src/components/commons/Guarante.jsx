import { ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Guarante = () => {
  const navigate = useNavigate();
  const services = [
    {
      name: "Buy TikTok Likes",
      url: "/tiktok",
    },
    {
      name: "Buy TikTok Followers",
      url: "/tiktok",
    },
  ]

  const data = [
    {
      title: "6-month views retention guarantee",
      des: "When you purchase real views from Buzzoid, they don't disappear after a few days or even a few months. That's one of the major reasons to buy our genuine interactions from real people. However, views can occasionally drop if a user leaves TikTok, or gives their account to a family member. We protect against that possibility by continually monitoring all customer accounts, and immediately replacing any dropped views for six months after your purchase.",
    },
    {
      title: "30-day money-back guarantee",
      des: "No ifs, ands, or buts. If you're unhappy with our delivery speed, service, views, or support, just let us know. We'll quickly issue a full refund.",
    },
  ]

  const handleServiceClick = (url) => {
    // For demonstration - you would use your routing solution here
    console.log(`Navigating to: ${url}`);
    // window.location.href = url; // or use your router
    navigate(url);
  };

  return (
    <>
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

      <div className="bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <h6 className="text-4xl font-bold text-center mb-8 text-gray-800">Buzzoid's Guarantees and Refund Policy</h6>
          <div className="rounded-3xl shadow-lg mt-20 bg-gradient-to-b from-blue-100 to-blue-50 max-w-4xl mx-auto py-10 px-8">
            <div className="space-y-6 p-5 rounded-3xl">
              <p className="text-gray-700 leading-relaxed">
                It's easy for a company to promise safety, service, and results, but that doesn't mean the company will
                deliver. Buzzoid backs up our promises with the most full-featured guarantees you'll get from any TikTok
                service provider.
              </p>
              <p className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold leading-relaxed">
                These guarantees apply to all of our clients, of course, but we hope they'll reassure first-time
                customers who are skittish about risking their money and Instagram accounts to buy Buzzoid's TikTok
                video views, likes, or followers. In short, there's no risk whatsoever when buying from Buzzoid
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto my-20">
            {data.map((item, index) => {
              return (
                <div
                  key={index}
                  className="px-6 py-8 space-y-4 rounded-3xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl bg-white border border-gray-200 cursor-pointer hover:transform hover:scale-105"
                >
                  <h6 className="text-center font-bold text-xl text-gray-800">{item.title}</h6>
                  <p className="text-center text-gray-600 text-sm leading-relaxed">{item.des}</p>
                </div>
              )
            })}
          </div>
          
          <p className="max-w-4xl mx-auto text-center text-gray-700 leading-relaxed">
            This isn't a "guarantee," but it's just as good. Our experienced customer support team is available{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-bold">24 hours a day</span> to handle any rare issues you may experience and solve
            them quickly. They're also happy to answer questions about Buzzoid's service or craft a custom order just
            for you.
          </p>

          <div className="max-w-5xl mx-auto py-20">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                More Growth Services from Buzzoid
              </h1>
              <p className="text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
                Honest, trustworthy, responsible, and powerful TikTok and Instagram growth is what we've specialized
                in for more than a dozen years. We invite you to join our family of satisfied customers today!
              </p>
            </div>
            
            {/* Fixed TikTok Services Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              {services.map((service, index) => (
                <button
                  key={index}
                  onClick={() => handleServiceClick(service.url)}
                  className="w-full sm:w-auto min-w-[250px] bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold px-6 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105 flex items-center justify-between group"
                >
                  <span className="uppercase tracking-wide">{service.name}</span>
                  <span className="ml-3 bg-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:rotate-45 transition-transform duration-300">
                    <ChevronRight className="text-pink-500 w-4 h-4" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Guarante;