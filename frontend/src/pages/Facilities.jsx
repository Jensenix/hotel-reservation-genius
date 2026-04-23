import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';
import Loading from '../components/ui/Loading';
import Button from '../components/common/Button';
import { 
  Shield, 
  Star, 
  CheckCircle,
  Sparkles,
  Wifi,
  Utensils,
  Dumbbell,
  Car,
  Coffee,
  Waves,
  Home as HomeIcon,
  MapPin,
  Users,
  Clock,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause
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
      const response = await apiService.facilities.getAll();
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Premium Amenities</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h1 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
              Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
            </h1>
            <Loading text="Discovering our world-class amenities..." size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (facilities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Premium Amenities</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h1 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
              Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
            </h1>
            <p className="text-xl text-slate-600 font-light">Our exceptional facilities are being prepared for your arrival</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
      <div className="container mx-auto px-4">
        {/* Hero Section - Luxury Upgrade */}
        <section className="py-20">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Premium Amenities</span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h1 className="text-6xl font-light text-slate-800 mb-8 tracking-tight">
              Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
              Experience world-class amenities meticulously designed to elevate your stay to extraordinary heights of comfort and sophistication
            </p>
            <div className="flex items-center justify-center space-x-8">
              <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium tracking-wide">24/7 Service</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
                <Star className="w-5 h-5" />
                <span className="font-medium tracking-wide">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
                <Shield className="w-5 h-5" />
                <span className="font-medium tracking-wide">Safe & Clean</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Carousel - Luxury Upgrade */}
        <div className="mb-24">
          <div className="relative max-w-5xl mx-auto">
            {/* Carousel Container */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-slate-100">
              <div className="relative h-[500px]">
                {facilities.map((facility, index) => (
                  <div
                    key={facility.id}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === currentIndex 
                        ? 'opacity-100 translate-x-0' 
                        : index < currentIndex 
                        ? 'opacity-0 -translate-x-full' 
                        : 'opacity-0 translate-x-full'
                    }`}
                  >
                    <div 
                      className="h-full cursor-pointer hover:shadow-2xl transition-all duration-500 bg-white"
                      onClick={() => handleCardClick(facility)}
                    >
                      <div className="h-full flex flex-col">
                        {/* Facility Image Placeholder */}
                        <div className="h-64 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="w-24 h-24 bg-white/90 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                                <span className="text-4xl font-bold text-amber-600">
                                  {facility.facilityName?.charAt(0) || 'F'}
                                </span>
                              </div>
                              <p className="text-white font-semibold tracking-wide text-lg">Premium Facility</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1 p-10">
                          <h3 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">
                            {facility.facilityName || 'Luxury Facility'}
                          </h3>
                          <p className="text-slate-600 leading-relaxed font-light text-lg mb-6">
                            {facility.iconUrl ? `Exclusive facility featuring ${facility.iconUrl}` : 'Experience unparalleled luxury and comfort in our premium facilities designed for the most discerning guests'}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-amber-600">
                              <Star className="w-5 h-5 fill-current" />
                              <span className="font-medium tracking-wide">5-Star Service</span>
                            </div>
                            <button className="text-amber-600 font-medium tracking-wide hover:text-amber-700 transition-colors">
                              Explore More →
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200"
                aria-label="Previous facility"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-slate-800 p-4 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200"
                aria-label="Next facility"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Auto-play Toggle Button */}
              <button
                onClick={toggleAutoPlay}
                className="absolute bottom-6 right-6 bg-white/90 hover:bg-white text-slate-800 p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 border border-slate-200"
                aria-label={isAutoPlaying ? "Pause auto-play" : "Start auto-play"}
              >
                {isAutoPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-3">
              {facilities.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-3 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? 'bg-amber-600 w-12 shadow-lg'
                      : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to facility ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Selected Facility Details - Luxury Modal */}
        {selectedFacility && (
          <div className="mb-24">
            <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div>
                  <div className="h-80 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-32 h-32 bg-white/90 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                          <span className="text-6xl font-bold text-amber-600">
                            {selectedFacility.facilityName?.charAt(0) || 'F'}
                          </span>
                        </div>
                        <p className="text-white font-semibold tracking-wide text-xl">Premium Facility</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-12">
                  <h2 className="text-4xl font-light text-slate-800 mb-6 tracking-tight">
                    {selectedFacility.facilityName || 'Luxury Facility'}
                  </h2>
                  <div className="prose prose-lg text-slate-600 mb-8">
                    <p className="leading-relaxed font-light text-lg">
                      {selectedFacility.iconUrl ? `Exclusive facility featuring premium ${selectedFacility.iconUrl} services` : 'Experience unparalleled luxury and sophistication in our premium facilities, meticulously designed to provide the ultimate comfort and convenience for our most discerning guests'}
                    </p>
                  </div>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center space-x-3 text-amber-600">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-medium tracking-wide">5-Star Premium Service</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium tracking-wide">24/7 Availability</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-600">
                      <Shield className="w-5 h-5" />
                      <span className="font-medium tracking-wide">Premium Quality Assurance</span>
                    </div>
                  </div>
                  <div className="mt-8">
                    <button 
                      className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide"
                      onClick={() => setSelectedFacility(null)}
                    >
                      Close Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Facilities Grid - Luxury Upgrade */}
        <div className="pb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-slate-800 mb-4 tracking-tight">
              All <span className="font-semibold text-amber-600">Premium Facilities</span>
            </h2>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto">
              Explore our complete collection of world-class amenities designed for your ultimate comfort
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {facilities.map((facility) => (
              <div 
                key={facility.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 border border-slate-100 overflow-hidden"
                onClick={() => handleCardClick(facility)}
              >
                <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <span className="text-2xl font-bold text-amber-600">
                          {facility.facilityName?.charAt(0) || 'F'}
                        </span>
                      </div>
                      <p className="text-white font-semibold tracking-wide text-sm">Premium</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-light text-slate-800 mb-3 tracking-tight">
                    {facility.facilityName || 'Luxury Facility'}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-light mb-6 line-clamp-2">
                    {facility.iconUrl ? `Premium ${facility.iconUrl} facility` : 'Experience luxury and comfort in our premium facilities'}
                  </p>
                  <button 
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-0 tracking-wide text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(facility);
                    }}
                  >
                    Discover More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Facilities;
