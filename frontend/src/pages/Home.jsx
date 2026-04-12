import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';

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
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            Welcome to Genius Society Hotel
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Experience luxury, comfort, and unforgettable moments in our premium accommodations
          </p>
          <div className="space-x-4">
            <Link to="/rooms">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Explore Rooms
              </Button>
            </Link>
            <Link to="/bookings">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Make Reservation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated selection of premium rooms and suites
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <Card key={room.id} hover={true} className="overflow-hidden">
                  {/* Room Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 mb-4 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {room.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
                    <p className="text-gray-600 line-clamp-2">{room.description}</p>
                    
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-3xl font-bold text-blue-600">
                          ${room.basePrice}
                        </span>
                        <span className="text-gray-500">/night</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Max:</span> {room.maxCapacity} guests
                      </div>
                    </div>
                    
                    <div className="pt-4 space-y-2">
                      <Button 
                        className="w-full"
                        onClick={() => navigate(`/booking/${room.id}`)}
                      >
                        Book Now
                      </Button>
                      <Link to={`/rooms/${room.id}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button variant="outline" size="lg">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Why Choose Genius Society Hotel?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏨</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Amenities</h3>
              <p className="text-gray-600">
                Experience world-class facilities and premium services designed for your comfort
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Prime Location</h3>
              <p className="text-gray-600">
                Located in the heart of the city with easy access to attractions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Exceptional Service</h3>
              <p className="text-gray-600">
                Our dedicated staff ensures your stay is nothing short of perfect
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
