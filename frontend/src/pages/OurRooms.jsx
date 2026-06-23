import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import Button from '@/components/common/Button';
import {
  Search,
  Filter,
  Users,
  DollarSign,
  Star,
  Wifi,
  MapPin,
  ChevronRight,
  Heart,
  CheckCircle,
  Shield,
} from 'lucide-react';

const OurRooms = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    capacity: '',
    priceRange: '',
    sortBy: 'name',
    search: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  // Parse query params on mount
  useEffect(() => {
    const capacity = searchParams.get('capacity') || '';
    const priceRange = searchParams.get('priceRange') || '';
    const sortBy = searchParams.get('sortBy') || 'name';
    const search = searchParams.get('search') || '';

    setFilters({
      capacity,
      priceRange,
      sortBy,
      search,
    });
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.capacity) params.set('capacity', filters.capacity);
    if (filters.priceRange) params.set('priceRange', filters.priceRange);
    if (filters.sortBy !== 'name') params.set('sortBy', filters.sortBy);
    if (filters.search) params.set('search', filters.search);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  const fetchRooms = async () => {
    try {
      // Fetch room types with their facilities from backend
      const response = await apiService.roomTypes.getAllWithFacilities();
      const roomTypesWithFacilities = response.data.data;

      setRooms(roomTypesWithFacilities);
    } catch (error) {
      console.error('Error fetching room types with facilities:', error);
      // Fallback to regular room types
      try {
        const fallbackResponse = await apiService.roomTypes.getAll();
        setRooms(fallbackResponse.data.data);
      } catch (fallbackError) {
        console.error('Fallback also failed:', fallbackError);
        setRooms([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredRooms = rooms
    .filter((room) => {
      let matchesCapacity =
        !filters.capacity || room.maxCapacity >= parseInt(filters.capacity);
      let matchesPrice =
        !filters.priceRange ||
        {
          budget: room.basePrice <= 100,
          mid: room.basePrice > 100 && room.basePrice <= 200,
          luxury: room.basePrice > 200,
        }[filters.priceRange];
      let matchesSearch =
        !filters.search ||
        room.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        room.description?.toLowerCase().includes(filters.search.toLowerCase());

      return matchesCapacity && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
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
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Star className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">
                LUXURY ACCOMMODATIONS
              </span>
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Rooms & Suites
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled comfort and elegance in our meticulously
              designed rooms and suites
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200"></div>
                  <div className="p-6">
                    <div className="h-6 bg-amber-200 rounded mb-3"></div>
                    <div className="h-4 bg-amber-100 rounded mb-2"></div>
                    <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Star className="w-6 h-6 text-amber-500" />
              <span className="text-lg font-light tracking-wider text-amber-600">
                LUXURY ACCOMMODATIONS
              </span>
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Our Rooms & Suites
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience unparalleled comfort and elegance in our meticulously
              designed rooms and suites
            </p>
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="flex items-center space-x-2 text-amber-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Premium Comfort</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Wifi className="w-5 h-5" />
                <span className="font-medium">Modern Amenities</span>
              </div>
              <div className="flex items-center space-x-2 text-amber-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium">5-Star Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-y border-amber-100">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find Your Perfect Room
                </h2>
                <p className="text-gray-600">
                  Search and filter our luxurious accommodations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search rooms..."
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3">
                  Search
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-amber-600" />
                  Capacity
                </label>
                <select
                  value={filters.capacity}
                  onChange={(e) =>
                    setFilters({ ...filters, capacity: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Capacities</option>
                  <option value="2">2+ Guests</option>
                  <option value="4">4+ Guests</option>
                  <option value="6">6+ Guests</option>
                </select>
              </div>

              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                  Price Range
                </label>
                <select
                  value={filters.priceRange}
                  onChange={(e) =>
                    setFilters({ ...filters, priceRange: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Prices</option>
                  <option value="budget">Budget ($0-$100)</option>
                  <option value="mid">Mid-Range ($100-$200)</option>
                  <option value="luxury">Luxury ($200+)</option>
                </select>
              </div>

              <div className="bg-white rounded-xl p-4 border border-amber-200">
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Filter className="w-4 h-4 mr-2 text-amber-600" />
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters({ ...filters, sortBy: e.target.value })
                  }
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
                  onClick={() =>
                    setFilters({ capacity: '', priceRange: '', sortBy: 'name' })
                  }
                  variant="outline"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Available Rooms
                <span className="ml-3 text-xl font-normal text-gray-600">
                  ({filteredRooms.length} rooms)
                </span>
              </h2>
              <p className="text-gray-600">
                Luxury accommodations tailored for your comfort
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredRooms.length} room
                {filteredRooms.length !== 1 ? 's' : ''} available
              </span>
            </div>
          </div>

          {filteredRooms.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-500 text-xl mb-4">
                No rooms found matching your criteria
              </div>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters to see more options
              </p>
              <Button
                onClick={() =>
                  setFilters({ capacity: '', priceRange: '', sortBy: 'name' })
                }
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRooms.map((room) => (
                <Card
                  key={room.id}
                  hover={true}
                  className="overflow-hidden group h-full flex flex-col"
                >
                  {/* Room Image */}
                  <div className="relative h-64 bg-gradient-to-br from-amber-400 to-amber-600 mb-6 overflow-hidden rounded-2xl">
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
                    <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full shadow-lg">
                      <span className="text-xs font-medium">
                        ${room.basePrice}/night
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between flex-shrink-0">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {room.name}
                        </h3>
                        <p className="text-gray-600 leading-relaxed line-clamp-3">
                          {room.description?.length > 150
                            ? `${room.description.substring(0, 150)}...`
                            : room.description}
                        </p>
                      </div>
                      <button className="p-2 rounded-full hover:bg-amber-50 transition-colors duration-200 ml-2 flex-shrink-0">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>

                    {/* Facilities */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0 min-h-[40px]">
                      {(room.facilities || []).slice(0, 3).map((facility) => (
                        <div
                          key={facility.id}
                          className="flex items-center px-3 py-2 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200 hover:bg-amber-100 transition-colors duration-200"
                          title={facility.facilityName}
                        >
                          <Wifi className="w-4 h-4 mr-1" />
                          {facility.facilityName}
                        </div>
                      ))}
                      {(room.facilities || []).length > 3 && (
                        <div className="flex items-center px-3 py-2 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                          +{(room.facilities || []).length - 3} more
                        </div>
                      )}
                    </div>

                    {/* Room Details */}
                    <div className="flex items-center justify-between pt-4 border-t border-amber-100 flex-shrink-0">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">
                            Max {room.maxCapacity} guests
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">
                            Floor {room.floor || '1'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-amber-600">
                          ${room.basePrice}
                        </div>
                        <span className="text-gray-500 text-sm">/night</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 space-y-3 mt-auto">
                      <Button
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium shadow-lg"
                        onClick={() => navigate(`/booking/${room.id}`)}
                      >
                        Book Now
                        <ChevronRight className="w-5 h-5 ml-2 inline" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OurRooms;
