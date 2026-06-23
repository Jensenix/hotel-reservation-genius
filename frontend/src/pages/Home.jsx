import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import {
  Home as HomeIcon,
  Users,
  Wifi,
  Car,
  Coffee,
  Dumbbell,
  Shield,
  MapPin,
  Star,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  Check,
  Clock,
  Utensils,
  Waves,
  Sparkles,
  Camera,
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRooms();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      const response = await apiService.roomTypes.getAll();
      setFeaturedRooms(response.data.data.slice(0, 3)); // Show first 3 rooms
    } catch (error) {
      console.error('Error fetching featured rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat -mt-32"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-light tracking-wider text-yellow-400">
                LUXURY & COMFORT
              </span>
              <Sparkles className="w-6 h-6 text-yellow-400" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Genius Society Hotel
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
              Where elegance meets exceptional service in the heart of the city
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link to="/facilities">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-xl border-2 border-amber-400"
              >
                Explore Facilities
              </Button>
            </Link>
            <Link to="/our-rooms">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold"
              >
                Make Reservation
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm">123 Luxury Ave, Paradise City</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">5-Star Luxury</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">Premium Service</span>
            </div>
          </div>
        </div>
      </section>

      {/* Accommodation Section - Luxury Upgrade */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                Luxury Stays
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
              Exquisite{' '}
              <span className="font-semibold text-amber-600">
                Accommodations
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Indulge in our meticulously curated rooms and suites, where every
              detail speaks the language of sophisticated luxury and
              unparalleled comfort
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
                  <div className="p-8">
                    <div className="h-4 bg-slate-200 rounded mb-4 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded mb-2 animate-pulse"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <div
                  key={room.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <HomeIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <p className="text-amber-600 font-semibold tracking-wide uppercase text-sm">
                          Room {room.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-light text-slate-800 mb-3 tracking-tight">
                      {room.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 font-light">
                      {room.description ||
                        'Experience the epitome of luxury with our meticulously designed accommodations featuring premium amenities and breathtaking views'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-600">
                        <Users className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">
                          Up to {room.capacity || 2} Guests
                        </span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Wifi className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">High-Speed Internet</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Coffee className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">Premium Amenities</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-3xl font-light text-slate-800">
                          ${room.basePrice}
                        </p>
                        <p className="text-sm text-slate-500 font-light">
                          per night
                        </p>
                      </div>
                      <Link to={`/booking/${room.id}`}>
                        <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide">
                          Reserve Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16">
            <Link to="/our-rooms">
              <button className="bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 tracking-wide">
                Discover All Suites
                <ChevronRight className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section - Luxury Upgrade */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                Premium Amenities
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
              World-Class{' '}
              <span className="font-semibold text-amber-600">Facilities</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Indulge in our exceptional amenities designed to elevate your stay
              to extraordinary heights of luxury and comfort
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Wifi className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">
                High-Speed WiFi
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Complimentary ultra-high speed internet throughout the entire
                hotel premises
              </p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Utensils className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">
                Fine Dining
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Award-winning restaurant serving exquisite international cuisine
                by master chefs
              </p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Dumbbell className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">
                Fitness Center
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                State-of-the-art gym with premium equipment and personal
                trainers
              </p>
            </div>

            <div className="group text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Car className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">
                Valet Parking
              </h3>
              <p className="text-slate-600 leading-relaxed font-light">
                Secure valet parking service available 24/7 with concierge
                assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - Luxury Upgrade */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/10 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                The Genius Difference
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
              The{' '}
              <span className="font-semibold text-amber-600">
                Genius Society
              </span>{' '}
              Experience
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Discover what sets us apart and transforms every stay into an
              unforgettable journey of luxury and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-amber-200">
                <HomeIcon className="w-14 h-14 text-amber-600" />
              </div>
              <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">
                Luxury Accommodations
              </h3>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                Experience world-class facilities and premium services designed
                for your ultimate comfort and relaxation beyond imagination
              </p>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-emerald-200">
                <MapPin className="w-14 h-14 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">
                Prime Location
              </h3>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                Located in the heart of the city with exclusive access to
                premier attractions, business districts, and entertainment
                venues
              </p>
            </div>

            <div className="text-center group">
              <div className="w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-slate-500">
                <Shield className="w-14 h-14 text-white" />
              </div>
              <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">
                Exceptional Service
              </h3>
              <p className="text-slate-600 leading-relaxed font-light text-lg">
                Our dedicated staff ensures your stay is nothing short of
                perfect with personalized attention to every detail and desire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Gallery Section - New Luxury Addition */}
      <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                Gallery
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
              Experience{' '}
              <span className="font-semibold text-amber-600">Luxury</span>{' '}
              Through Images
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Take a visual journey through our exquisite spaces and discover
              the elegance that awaits your arrival
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              'Lobby',
              'Suite',
              'Restaurant',
              'Pool',
              'Spa',
              'Bar',
              'Garden',
              'Conference',
            ].map((item, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
              >
                <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Camera className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-700 font-semibold tracking-wide uppercase text-sm">
                      {item}
                    </p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/#">
              <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide">
                View Full Gallery
                <ChevronRight className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New Luxury Addition */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
              <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
                Guest Voices
              </span>
              <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
              What Our{' '}
              <span className="font-semibold text-amber-600">Guests Say</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
              Discover why our guests return time and again to experience the
              unparalleled luxury and service at Genius Society Hotel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                name: 'Alexander Thompson',
                title: 'CEO, Global Ventures',
                content:
                  'Absolutely exceptional! The attention to detail and service excellence exceeded all expectations. This is luxury redefined.',
                rating: 5,
              },
              {
                name: 'Sophia Martinez',
                title: 'Award-Winning Designer',
                content:
                  'Every moment was perfection. The blend of elegance and comfort creates an unforgettable experience that lingers in memory.',
                rating: 5,
              },
              {
                name: 'James Chen',
                title: 'International Diplomat',
                content:
                  'Outstanding in every aspect. The staff anticipates needs before they arise. True five-star excellence in hospitality.',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 border border-slate-100"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 font-light italic text-lg">
                  "{testimonial.content}"
                </p>
                <div className="text-center">
                  <p className="text-slate-800 font-semibold text-lg mb-2">
                    {testimonial.name}
                  </p>
                  <p className="text-slate-500 text-sm font-light">
                    {testimonial.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
