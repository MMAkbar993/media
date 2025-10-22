const InfoCard = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center p-4 bg-white rounded-2xl shadow-xl hover:shadow transition">
    <img src={icon || "/placeholder.svg"} alt={title} className="w-20 h-20 mb-4" />
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
)

const InfoSection = ({ title, highlight, subtitle, cards }) => {
  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="custom-container text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          {title} <span className="text-gradient">{highlight}</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">{subtitle}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default InfoSection
