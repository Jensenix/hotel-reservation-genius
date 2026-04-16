import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/ui/Loading';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiService } from '../../services/api';

const RoomAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [expandedRoomType, setExpandedRoomType] = useState(null);

  useEffect(() => {
    fetchAvailabilityData();
  }, [selectedDate]);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getRoomAvailabilityStats({
        date: selectedDate
      });

      if (response.data.success) {
        setAvailabilityData(response.data.data);
      } else {
        console.error('Error fetching availability data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching availability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'cleaning':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'occupied':
        return 'Occupied';
      case 'maintenance':
        return 'Maintenance';
      case 'cleaning':
        return 'Cleaning';
      default:
        return status;
    }
  };

  const toggleRoomTypeDetails = (roomTypeId) => {
    setExpandedRoomType(expandedRoomType === roomTypeId ? null : roomTypeId);
  };

  if (loading || !availabilityData) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loading size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Room Availability Dashboard</h1>
          <p className="mt-2 text-gray-600">Monitor real-time room availability by room type</p>
        </div>

        {/* Date Filter */}
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check Availability Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  variant="secondary"
                >
                  Today
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Rooms</p>
                  <p className="text-3xl font-bold">{availabilityData.overall.totalRooms}</p>
                </div>
                <div className="p-3 bg-blue-700 bg-opacity-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Available Rooms</p>
                  <p className="text-3xl font-bold">{availabilityData.overall.availableRooms}</p>
                  <p className="text-sm text-green-200 mt-1">{availabilityData.overall.availabilityRate}% available</p>
                </div>
                <div className="p-3 bg-green-700 bg-opacity-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">Occupied Rooms</p>
                  <p className="text-3xl font-bold">{availabilityData.overall.occupiedRooms}</p>
                  <p className="text-sm text-red-200 mt-1">{availabilityData.overall.occupancyRate}% occupied</p>
                </div>
                <div className="p-3 bg-red-700 bg-opacity-50 rounded-lg">
                  <svg className="w-6 h-6 text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Maintenance</p>
                  <p className="text-3xl font-bold">{availabilityData.overall.maintenanceRooms}</p>
                  <p className="text-sm text-yellow-200 mt-1">Under repair</p>
                </div>
                <div className="p-3 bg-yellow-700 bg-opacity-50 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Room Type Availability */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Availability by Room Type</h2>
          
          {availabilityData.byRoomType.map((roomType) => (
            <Card key={roomType.roomTypeId} className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{roomType.roomTypeName}</h3>
                    <p className="text-sm text-gray-600">Base Price: ${roomType.basePrice}/night</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Available</p>
                      <p className="text-2xl font-bold text-green-600">
                        {roomType.availableRooms} / {roomType.totalRooms}
                      </p>
                    </div>
                    <Button 
                      onClick={() => toggleRoomTypeDetails(roomType.roomTypeId)}
                      variant="secondary"
                      size="sm"
                    >
                      {expandedRoomType === roomType.roomTypeId ? 'Hide Details' : 'Show Details'}
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${roomType.availabilityPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {roomType.availabilityPercentage}% availability rate
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600 font-medium">Available</p>
                    <p className="text-xl font-bold text-green-700">{roomType.availableRooms}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600 font-medium">Occupied</p>
                    <p className="text-xl font-bold text-red-700">{roomType.occupiedRooms}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-yellow-600 font-medium">Maintenance</p>
                    <p className="text-xl font-bold text-yellow-700">{roomType.maintenanceRooms}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-600 font-medium">Cleaning</p>
                    <p className="text-xl font-bold text-blue-700">{roomType.cleaningRooms}</p>
                  </div>
                </div>

                {/* Detailed Room List */}
                {expandedRoomType === roomType.roomTypeId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Room Details</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {roomType.rooms.map((room) => (
                        <div 
                          key={room.id}
                          className={`p-3 rounded-lg border-2 ${getStatusColor(room.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          <p className="font-semibold">{room.roomNumber}</p>
                          <p className="text-xs opacity-75">{getStatusBadge(room.status)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoomAvailability;
