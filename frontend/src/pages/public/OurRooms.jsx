import { useState } from 'react';
import { useOurRooms } from '@/hooks/public/useOurRooms';
import OurRoomsHero from '@/components/rooms/OurRoomsHero';
import RoomFilters from '@/components/rooms/RoomFilters';
import RoomList from '@/components/rooms/RoomList';
import RoomSkeleton from '@/components/rooms/RoomSkeleton';
import Button from '@/components/ui/Button';
import { Calendar, Search, Map } from 'lucide-react';

const OurRooms = () => {
  const { loading, filters, updateFilters, clearFilters, filteredRooms } = useOurRooms();
  
  // Lazily initialize modal state based on the URL context on load
  const [showDateModal, setShowDateModal] = useState(() => !filters.checkIn || !filters.checkOut);
  const [tempCheckIn, setTempCheckIn] = useState('');
  const [tempCheckOut, setTempCheckOut] = useState('');

  const handleSearchDates = () => {
    if (tempCheckIn && tempCheckOut) {
      updateFilters({ checkIn: tempCheckIn, checkOut: tempCheckOut });
      setShowDateModal(false);
    }
  };

  const handleJustBrowsing = () => {
    setShowDateModal(false);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const minCheckOutStr = tempCheckIn 
    ? new Date(new Date(tempCheckIn).getTime() + 86400000).toISOString().split('T')[0] 
    : todayStr;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white relative">
      
      {/* Pop-up Date Modal Overlay */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
                <Calendar className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">When are you staying?</h2>
              <p className="text-gray-500 mt-2">Enter your dates to see real-time room availability and exact pricing.</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="tempCheckIn" className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input
                  id="tempCheckIn"
                  type="date"
                  min={todayStr}
                  value={tempCheckIn}
                  onChange={(e) => {
                    setTempCheckIn(e.target.value);
                    if (tempCheckOut && tempCheckOut <= e.target.value) setTempCheckOut('');
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="tempCheckOut" className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <input
                  id="tempCheckOut"
                  type="date"
                  disabled={!tempCheckIn}
                  min={minCheckOutStr}
                  value={tempCheckOut}
                  onChange={(e) => setTempCheckOut(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleSearchDates} 
                disabled={!tempCheckIn || !tempCheckOut}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg flex justify-center items-center"
              >
                <Search className="w-5 h-5 mr-2" /> Show Available Rooms
              </Button>
              <button 
                onClick={handleJustBrowsing}
                className="w-full py-2 text-gray-500 hover:text-amber-700 font-medium flex justify-center items-center transition-colors"
              >
                <Map className="w-4 h-4 mr-2" /> Just browsing for now
              </button>
            </div>
          </div>
        </div>
      )}

      <OurRoomsHero />
      <RoomFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
      />
      {loading ? (
        <RoomSkeleton />
      ) : (
        <RoomList rooms={filteredRooms} clearFilters={clearFilters} />
      )}
    </div>
  );
};

export default OurRooms;