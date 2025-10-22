import { useState, Children, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Carousel = ({ children, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalSlides = Children.count(children);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, autoPlay, interval]);

  // Swipe Handling with improved touch detection
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = (e) => {
    setTouchStartX(e.changedTouches[0].screenX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setTouchEndX(e.changedTouches[0].screenX);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        nextSlide(); // swipe left
      } else {
        prevSlide(); // swipe right
      }
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-gray-50">
      {/* Main Carousel Container */}
      <div 
        className="relative w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'pan-y pinch-zoom' }}
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full flex justify-center"
            >
              {/* Responsive container that adapts to screen size */}
              <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                {child}
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows (desktop only) */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 z-10 group"
              aria-label="Previous slide"
            >
              <FaChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full hover:bg-white shadow-lg hover:shadow-xl transition-all duration-300 z-10 group"
              aria-label="Next slide"
            >
              <FaChevronRight size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Dot Indicators (mobile-friendly) */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 mb-4 space-x-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-orange-500 scale-110'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile swipe indicator (optional visual hint) */}
      <div className="lg:hidden flex justify-center mt-2 mb-4">
        <div className="flex items-center text-xs text-gray-500 bg-white/80 px-3 py-1 rounded-full">
          <span>Swipe to navigate</span>
          <div className="ml-2 flex space-x-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carousel;