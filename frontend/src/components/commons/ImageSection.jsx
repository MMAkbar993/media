const ImageSection = ({ heading, title, des, imgPosition = "right", image }) => {
  return (
    <div className="py-12">
      <div className="custom-container">
        <div
          className={`flex flex-col lg:flex-row items-center gap-8 ${
            imgPosition === "right" ? "lg:flex-row-reverse" : ""
          }`}
        >
          <div className="lg:w-1/2">
            <img
              src={image || "/placeholder.svg?height=400&width=600"}
              alt={heading}
              className="rounded-2xl shadow-lg w-full h-auto max-w-md mx-auto lg:max-w-none object-cover"
              style={{ maxHeight: '300px' }}
            />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left space-y-6">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">{heading}</h2>
              <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-4 leading-relaxed">{title}</h3>
              <p className="text-gray-600 leading-relaxed text-base">{des}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageSection
