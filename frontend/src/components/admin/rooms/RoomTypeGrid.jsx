import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Search, Layers, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const RoomTypeGrid = ({
  filteredRoomTypes,
  loading,
  searchTerm,
  setSearchTerm,
  handleOpenRoomTypeModal,
  setDeleteTarget,
  setShowDeleteModal,
}) => {
  const getRoomCount = (roomType) => roomType.rooms?.length || 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-5 sm:p-8 mb-6 sm:mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search room types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredRoomTypes.map((roomType) => (
            <div
              key={roomType.id}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
            >
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                      <Layers className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                        Rooms
                      </p>
                      <p className="text-white text-2xl sm:text-3xl font-light">
                        {getRoomCount(roomType)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-2 sm:mb-3 tracking-tight">
                    {roomType.name}
                  </h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed line-clamp-2">
                    {roomType.description || 'No description'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                        Price
                      </p>
                      <p className="text-white font-semibold text-base sm:text-lg">
                        ${roomType.basePrice}/night
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-1">
                        Capacity
                      </p>
                      <p className="text-white font-semibold text-base sm:text-lg">
                        {roomType.maxCapacity} guests
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-white">
                <div className="flex gap-2 sm:gap-3">
                  <Link
                    to={`/admin/rooms/${roomType.id}`}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 text-center text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="whitespace-nowrap">View Rooms</span>
                  </Link>
                  <Button
                    onClick={() => handleOpenRoomTypeModal(roomType)}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setDeleteTarget({ id: roomType.id, name: roomType.name });
                      setShowDeleteModal(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredRoomTypes.length === 0 && !loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 sm:py-16">
              <Layers className="w-16 h-16 sm:w-20 sm:h-20 text-slate-300 mx-auto mb-4 sm:mb-6" />
              <p className="text-slate-500 text-base sm:text-lg mb-4">No room types found</p>
              <Button
                onClick={() => handleOpenRoomTypeModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-6 sm:px-8 py-3 rounded-xl font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Room Type
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

RoomTypeGrid.propTypes = {
  roomTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredRoomTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  handleOpenRoomTypeModal: PropTypes.func.isRequired,
  setDeleteTarget: PropTypes.func.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
};

export default RoomTypeGrid;