import { useState } from 'react';
import { Star } from 'lucide-react';

export default function ReviewSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    review: ''
  });

  const [reviews] = useState([
    {
      id: 1,
      rating: 5,
      text: "I'll never understand how you got my page 50,000 additional Instagram followers. You guys are the best!",
      author: "Anonymous"
    },
    {
      id: 2,
      rating: 5,
      text: "They are good at what they do. I'm buying more.",
      author: "Anonymous"
    },
    {
      id: 3,
      rating: 5,
      text: "Actually worked and very professional.",
      author: "Mary"
    },
    {
      id: 4,
      rating: 5,
      text: "Awesome app. I highly recommend",
      author: "Jose Fernandez"
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStarClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = () => {
    console.log('Review submitted:', formData);
    // Reset form
    setFormData({
      name: '',
      email: '',
      rating: 0,
      review: ''
    });
  };

  const renderStars = (rating, interactive = false, size = 'w-5 h-5') => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating 
                ? 'fill-orange-400 text-orange-400' 
                : interactive 
                  ? 'text-gray-300 hover:text-orange-400 cursor-pointer' 
                  : 'text-gray-300'
            }`}
            onClick={interactive ? () => handleStarClick(star) : undefined}
          />
        ))}
      </div>
    );
  };

  const renderTrustpilotStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating 
                ? 'fill-green-500 text-green-500' 
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Reviews
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're built on reliability, speed, and affordable pricing. See what our customers say:
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left side - Submit Review Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Submit Your Review</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(formData.rating, true)}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Write your review here..."
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-md transition duration-200 uppercase tracking-wide"
              >
                Submit Review
              </button>
            </div>
          </div>

          {/* Right side - Customer Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="mb-3">
                  {renderTrustpilotStars(review.rating)}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                {review.text}
                </p>
                <p className="text-sm text-gray-500">
                  {review.author}
                </p>
              </div>
            ))}
            
            {/* Show All Reviews Button */}
            <div className="text-center pt-6">
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-8 rounded-md transition duration-200 uppercase tracking-wide">
                Show All Reviews
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}