import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/common/Button';

const Rooms = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    capacity: '',
    priceRange: '',
    sortBy: 'name'
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      // Fetch room types directly - this is what we want to display
      const response = await apiService.getRoomTypes();
      const roomTypes = response.data.data;
      
      console.log('Room Types:', roomTypes);
      setRooms(roomTypes);
    } catch (error) {
      console.error('Error fetching room types:', error);
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms.filter(room => {
    let matchesCapacity = !filters.capacity || room.maxCapacity >= parseInt(filters.capacity);
    let matchesPrice = !filters.priceRange || {
      budget: room.basePrice <= 100,
      mid: room.basePrice > 100 && room.basePrice <= 200,
      luxury: room.basePrice > 200
    }[filters.priceRange];
    
    return matchesCapacity && matchesPrice;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'price-low':
        return a.basePrice - b.basePrice;
      case 'price-high':
        return b.basePrice - a.basePrice;
      case 'capacity':
        return b.maxCapacity - a.maxCapacity;
      default:
        return a.name.localeCompare(b.name);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-12">Our Rooms & Suites</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <Card>
                  <div className="h-48 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our selection of premium accommodations designed for your comfort
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Capacity
              </label>
              <select
                value={filters.capacity}
                onChange={(e) => setFilters({...filters, capacity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Capacities</option>
                <option value="2">2+ Guests</option>
                <option value="4">4+ Guests</option>
                <option value="6">6+ Guests</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Prices</option>
                <option value="budget">Budget ($0-$100)</option>
                <option value="mid">Mid-Range ($100-$200)</option>
                <option value="luxury">Luxury ($200+)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={() => setFilters({ capacity: '', priceRange: '', sortBy: 'name' })}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filteredRooms.length}</span> room{filteredRooms.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-xl mb-4">
              No rooms found matching your criteria
            </div>
            <Button onClick={() => setFilters({ capacity: '', priceRange: '', sortBy: 'name' })}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <Card key={room.id} hover={true} className="overflow-hidden">
                {/* Room Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 mb-4 flex items-center justify-center relative">
                  <span className="text-white text-6xl font-bold">
                    {room.name.charAt(0)}
                  </span>
                  <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full">
                    <span className="text-xs font-medium text-blue-600">
                      {room.maxCapacity} Guests
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900">{room.name}</h3>
                  <p className="text-gray-600 line-clamp-3">{room.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        ${room.basePrice}
                      </span>
                      <span className="text-gray-500 text-sm">/night</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Max {room.maxCapacity} guests
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => navigate(`/booking/${room.id}`)}
                    >
                      Book Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
