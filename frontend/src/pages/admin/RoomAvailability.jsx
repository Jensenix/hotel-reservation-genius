import React, { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Loading from '@/components/ui/Loading';
import AdminLayout from '@/components/layout/AdminLayout';
import apiService from '@/services/apiService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';

const RoomAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedRoomType, setExpandedRoomType] = useState(null);

  // Helper function to convert Date to string (local timezone)
  const dateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    console.log('Date changed to:', selectedDate);
    fetchAvailabilityData();
  }, [selectedDate]);

  const fetchAvailabilityData = async () => {
    try {
      setLoading(true);
      const dateString = dateToString(selectedDate);
      console.log('Selected Date object:', selectedDate);
      console.log('Selected Date ISO:', selectedDate.toISOString());
      console.log('Converted to local string:', dateString);
      console.log('Fetching availability for date:', dateString);
      const response = await apiService.roomAvailability.getStats({
        date: dateString,
      });

      console.log('Availability data response:', response.data);
      if (response.data.success) {
        setAvailabilityData(response.data.data);
      } else {
        console.error(
          'Error fetching availability data:',
          response.data.message,
        );
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with elegant styling */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
                  Room{' '}
                  <span className="font-semibold text-amber-600">
                    Availability
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide uppercase">
                  Real-time Room Status & Management
                </p>
              </div>
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest">
                    GENIUS SOCIETY HOTEL
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="MMMM d, yyyy"
                      placeholderText="Select date"
                      className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      const today = new Date();
                      setSelectedDate(today);
                    }}
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
            {/* Total Rooms - Elegant Card */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Total Rooms
                </p>
                <p className="text-3xl font-light text-white">
                  {availabilityData.overall.totalRooms}
                </p>
                <p className="text-sm text-slate-400 mt-1">All rooms</p>
              </div>
            </div>

            {/* Available Rooms - Elegant Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 border border-emerald-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Available
                  </span>
                </div>
                <p className="text-emerald-100 text-xs uppercase tracking-wider mb-1">
                  Available Rooms
                </p>
                <p className="text-3xl font-light text-white">
                  {availabilityData.overall.availableRooms}
                </p>
                <p className="text-sm text-emerald-100 mt-1">
                  {availabilityData.overall.availabilityRate}% available
                </p>
              </div>
            </div>

            {/* Occupied Rooms - Elegant Card */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Occupied
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Occupied Rooms
                </p>
                <p className="text-3xl font-light text-white">
                  {availabilityData.overall.occupiedRooms}
                </p>
                <p className="text-sm text-slate-400 mt-1">
                  {availabilityData.overall.occupancyRate}% occupied
                </p>
              </div>
            </div>

            {/* Maintenance - Elegant Card */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Maintenance
                  </span>
                </div>
                <p className="text-amber-100 text-xs uppercase tracking-wider mb-1">
                  Under Repair
                </p>
                <p className="text-3xl font-light text-white">
                  {availabilityData.overall.maintenanceRooms}
                </p>
                <p className="text-sm text-amber-100 mt-1">Under repair</p>
              </div>
            </div>
          </div>

          {/* Room Type Availability - Elegant Section */}
          <div className="space-y-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-1">
                Availability by Room Type
              </h2>
              <p className="text-sm text-slate-500">
                Detailed room status by category
              </p>
            </div>

            {availabilityData.byRoomType.map((roomType) => (
              <div
                key={roomType.roomTypeName}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() =>
                    setExpandedRoomType(
                      expandedRoomType === roomType.roomTypeName
                        ? null
                        : roomType.roomTypeName,
                    )
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {roomType.roomTypeName}
                      </h3>
                      <p className="text-sm text-slate-500">
                        {roomType.totalRooms} rooms total
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-600">
                        {roomType.availableRooms}
                      </p>
                      <p className="text-xs text-slate-500">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-600">
                        {roomType.occupiedRooms}
                      </p>
                      <p className="text-xs text-slate-500">Occupied</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {roomType.maintenanceRooms}
                      </p>
                      <p className="text-xs text-slate-500">Maintenance</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {roomType.cleaningRooms}
                      </p>
                      <p className="text-xs text-slate-500">Cleaning</p>
                    </div>
                    <svg
                      className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedRoomType === roomType.roomTypeName ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {expandedRoomType === roomType.roomTypeName && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {roomType.rooms.map((room) => (
                      <div
                        key={room.id}
                        className="bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {room.roomNumber}
                            </p>
                            <p className="text-xs text-slate-500">
                              {getStatusBadge(room.status)}
                            </p>
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${getStatusColor(room.status).split(' ')[0]}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoomAvailability;
