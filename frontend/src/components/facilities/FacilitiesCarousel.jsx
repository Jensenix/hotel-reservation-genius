import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * @param {number} index
 * @param {number} currentIndex
 * @returns {string}
 */
const getSlideClasses = (index, currentIndex) => {
  if (index === currentIndex) return 'opacity-100 translate-x-0';
  if (index < currentIndex) return 'opacity-0 -translate-x-full';
  return 'opacity-0 translate-x-full';
};

/**
 * @param {Object} props
 * @param {Array<Object>} props.facilities
 * @param {Function} props.onSelectFacility
 * @returns {JSX.Element}
 */
const FacilitiesCarousel = ({ facilities, onSelectFacility }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || facilities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === facilities.length - 1 ? 0 : prevIndex + 1,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, facilities.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === facilities.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? facilities.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  const handleKeyDown = (e, facility) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectFacility(facility);
    }
  };

  return (
    <div className="mb-16 sm:mb-24 px-4 sm:px-0">
      <div className="relative max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100">
          <div className="relative h-[550px] sm:h-[500px]">
            {facilities.map((facility, index) => (
              <div
                key={facility.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${getSlideClasses(index, currentIndex)}`}
              >
                <div
                  className="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white"
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectFacility(facility)}
                  onKeyDown={(e) => handleKeyDown(e, facility)}
                >
                  <div className="h-full flex flex-col">
                    <div className="h-48 sm:h-64 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden shrink-0">
                      <div className="absolute inset-0 bg-black/10"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/90 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-xl">
                            <span className="text-3xl sm:text-4xl font-bold text-amber-600">
                              {facility.facilityName?.charAt(0) || 'F'}
                            </span>
                          </div>
                          <p className="text-white font-semibold tracking-wide text-sm sm:text-lg">
                            Premium Facility
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-light text-slate-800 mb-3 sm:mb-4 tracking-tight line-clamp-1">
                          {facility.facilityName || 'Luxury Facility'}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-light text-base sm:text-lg mb-4 sm:mb-6 line-clamp-3">
                          {facility.iconUrl
                            ? `Exclusive facility featuring ${facility.iconUrl}`
                            : 'Experience unparalleled luxury and comfort in our premium facilities designed for the most discerning guests'}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center space-x-2 text-amber-600">
                          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                          <span className="font-medium tracking-wide text-sm sm:text-base">
                            5-Star Service
                          </span>
                        </div>
                        <span className="text-amber-600 font-medium tracking-wide hover:text-amber-700 transition-colors text-sm sm:text-base">
                          Explore More →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 sm:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Previous facility"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-2 sm:p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Next facility"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/90 hover:bg-white text-slate-800 p-2 sm:p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
          >
            {isAutoPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>

        <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
          {facilities.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 sm:h-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-amber-600 w-8 sm:w-12 shadow-lg'
                  : 'bg-slate-300 hover:bg-slate-400 w-2 sm:w-3'
              }`}
              aria-label={`Go to facility ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

FacilitiesCarousel.propTypes = {
  facilities: PropTypes.array.isRequired,
  onSelectFacility: PropTypes.func.isRequired,
};

export default FacilitiesCarousel;
