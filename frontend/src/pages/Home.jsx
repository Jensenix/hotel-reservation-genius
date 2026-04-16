import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';
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
  Sparkles
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
      const response = await apiService.getRoomTypes();
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
      <section className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" 
             style={{backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)'}}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-light tracking-wider text-yellow-400">LUXURY & COMFORT</span>
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
            <Link to="/rooms">
              <Button size="lg" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-xl border-2 border-amber-400">
                Explore Rooms
              </Button>
            </Link>
            <Link to="/bookings">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold">
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

      {/* Featured Rooms */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <HomeIcon className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-light tracking-wider text-blue-600">ACCOMMODATIONS</span>
              <HomeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Luxury Rooms & Suites
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled comfort in our elegantly designed rooms, each offering a unique blend of modern luxury and timeless elegance
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-2xl mb-6"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {featuredRooms.map((room) => (
                <Card key={room.id} hover={true} className="overflow-hidden group">
                  {/* Room Image with overlay */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-400 to-blue-600 mb-6 overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-white text-6xl font-bold mb-2">
                          {room.name.charAt(0)}
                        </div>
                        <div className="text-white/90 text-sm">
                          {room.maxCapacity} Guests
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{room.name}</h3>
                      <p className="text-gray-600 leading-relaxed line-clamp-3">{room.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div>
                        <p className="text-3xl font-bold text-blue-600">${room.basePrice}</p>
                        <p className="text-sm text-gray-500">per night</p>
                      </div>
                      <Link to={`/booking/${room.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/our-rooms">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-8 py-3 text-lg">
                View All Rooms
                <ChevronRight className="w-5 h-5 ml-2 inline" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-light tracking-wider text-blue-600">FACILITIES & SERVICES</span>
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              World-Class Amenities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Indulge in our premium facilities designed to elevate your stay to extraordinary heights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Wifi className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">High-Speed WiFi</h3>
              <p className="text-gray-600 text-center">Complimentary high-speed internet throughout the hotel</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Utensils className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Fine Dining</h3>
              <p className="text-gray-600 text-center">Award-winning restaurant serving international cuisine</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Dumbbell className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Fitness Center</h3>
              <p className="text-gray-600 text-center">State-of-the-art gym with modern equipment</p>
            </div>
            
            <div className="group">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Car className="w-10 h-10 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Valet Parking</h3>
              <p className="text-gray-600 text-center">Secure parking with valet service available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-light tracking-wider text-yellow-500">WHY CHOOSE US</span>
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              The Genius Society Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover what sets us apart and makes every stay truly memorable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <HomeIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Luxury Accommodations</h3>
              <p className="text-gray-600 leading-relaxed">
                Experience world-class facilities and premium services designed for your ultimate comfort and relaxation
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <MapPin className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Prime Location</h3>
              <p className="text-gray-600 leading-relaxed">
                Located in the heart of the city with easy access to attractions, business centers, and entertainment venues
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-50 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">Exceptional Service</h3>
              <p className="text-gray-600 leading-relaxed">
                Our dedicated staff ensures your stay is nothing short of perfect with personalized attention to detail
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
