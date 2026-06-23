import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { Search, Layers, ChevronRight, Edit, Trash2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const RoomTypeGrid = ({ 
  filteredRoomTypes, 
  loading, 
  searchTerm, 
  setSearchTerm, 
  handleOpenRoomTypeModal, 
  setDeleteTarget, 
  setShowDeleteModal 
}) => {
  const getRoomCount = (roomType) => roomType.rooms?.length || 0;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search room types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRoomTypes.map((roomType) => (
            <div key={roomType.id} className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group">
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                      <Layers className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Rooms</p>
                      <p className="text-white text-3xl font-light">{getRoomCount(roomType)}</p>
                    </div>
                  </div>
                  <h3 className="text-2xl font-light text-white mb-3 tracking-tight">{roomType.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 leading-relaxed">{roomType.description || 'No description'}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Price</p>
                      <p className="text-white font-semibold text-lg">${roomType.basePrice}/night</p>
                    </div>
                    <div>
                      <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Capacity</p>
                      <p className="text-white font-semibold text-lg">{roomType.maxCapacity} guests</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="flex gap-3">
                  <Link
                    to={`/admin/rooms/${roomType.id}`}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 rounded-xl px-4 py-3 text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <ChevronRight className="w-4 h-4 inline mr-2" />
                    View Rooms
                  </Link>
                  <Button onClick={() => handleOpenRoomTypeModal(roomType)} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setDeleteTarget({ id: roomType.id, name: roomType.name });
                      setShowDeleteModal(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {filteredRoomTypes.length === 0 && !loading && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
              <Layers className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <p className="text-slate-500 text-lg mb-4">No room types found</p>
              <Button onClick={() => handleOpenRoomTypeModal()} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold">
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
  setShowDeleteModal: PropTypes.func.isRequired
};

export default RoomTypeGrid;