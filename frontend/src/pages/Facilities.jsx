import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import Button from '../components/common/Button';
import { 
  Shield, 
  Star, 
  CheckCircle,
  Sparkles
} from 'lucide-react';

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    fetchFacilities();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || facilities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === facilities.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, facilities.length]);

  const fetchFacilities = async () => {
    try {
      const response = await apiService.getFacilities();
      console.log('Facilities response:', response.data);
      console.log('Facilities array:', response.data.data);
      console.log('Number of facilities:', response.data.data?.length);
      setFacilities(response.data.data || []);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === facilities.length - 1 ? 0 : prevIndex + 1;
      console.log('Next slide - Current index:', newIndex, 'Total facilities:', facilities.length);
      console.log('Current facility:', facilities[newIndex]);
      return newIndex;
    });
  };

  const prevSlide = () => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? facilities.length - 1 : prevIndex - 1;
      console.log('Prev slide - Current index:', newIndex, 'Total facilities:', facilities.length);
      console.log('Current facility:', facilities[newIndex]);
      return newIndex;
    });
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false); // Pause auto-play when user manually navigates
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  const handleCardClick = (facility) => {
    setSelectedFacility(facility);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">WORLD-CLASS AMENITIES</span>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Facilities</h1>
            <Loading text="Loading facilities..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">WORLD-CLASS AMENITIES</span>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Facilities</h1>
            <p className="text-gray-600 text-lg">No facilities available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="py-20">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">WORLD-CLASS AMENITIES</span>
              <Sparkles className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">Our Premium Facilities</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience world-class amenities designed for your comfort and enjoyment
            </p>
            <div className="flex items-center justify-center space-x-6 mt-8">
              <div className="flex items-center space-x-2 text-amber-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">24/7 Service</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Star className="w-5 h-5" />
                <span className="font-medium">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium">Safe & Clean</span>
              </div>
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <div className="mb-16">
          <div className="relative max-w-4xl mx-auto">
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative h-96">
                {facilities.map((facility, index) => (
                  <div
                    key={facility.id}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentIndex 
                        ? 'opacity-100 translate-x-0' 
                        : index < currentIndex 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <Card 
                      className="h-full cursor-pointer hover:shadow-2xl transition-all duration-300"
                      onClick={() => handleCardClick(facility)}
                    >
                      <div className="h-full flex flex-col">
                        {/* Facility Image Placeholder */}
                        <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 rounded-t-xl flex items-center justify-center mb-4">
                          <span className="text-white text-6xl font-bold">
                            {facility.facilityName?.charAt(0) || 'F'}
                          </span>
                        </div>
                        
                        <div className="flex-1 p-6">
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">
                            {facility.facilityName || 'Unknown Facility'}
                          </h3>
                          <p className="text-gray-600 line-clamp-3">
                            {facility.iconUrl ? `Facility with icon: ${facility.iconUrl}` : 'No description available'}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Previous facility"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Next facility"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Auto-play Toggle Button */}
              <button
                onClick={toggleAutoPlay}
                className="absolute bottom-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
              >
                {isAutoPlaying ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {facilities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-blue-600 w-8'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selected Facility Details */}
        {selectedFacility && (
          <div className="mb-16">
            <Card className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-8xl font-bold">
                      {selectedFacility.facilityName?.charAt(0) || 'F'}
                    </span>
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {selectedFacility.facilityName || 'Unknown Facility'}
                  </h2>
                  <div className="prose prose-lg text-gray-600">
                    <p className="leading-relaxed">
                      {selectedFacility.iconUrl ? `Facility icon: ${selectedFacility.iconUrl}` : 'No description available'}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedFacility(null)}
                    >
                      Close Details
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* All Facilities Grid */}
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            All Facilities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility) => (
              <Card 
                key={facility.id}
                className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick(facility)}
              >
                <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {facility.facilityName?.charAt(0) || 'F'}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {facility.facilityName || 'Unknown Facility'}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {facility.iconUrl ? `Icon: ${facility.iconUrl}` : 'No description available'}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(facility);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
