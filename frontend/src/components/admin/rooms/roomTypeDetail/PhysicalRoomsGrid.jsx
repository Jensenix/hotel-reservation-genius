import Button from '@/components/ui/Button';
import { Bed, Edit, Trash2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';
import RoomStatusSelector from '@/components/admin/rooms/RoomStatusSelector';

/**
 * @param {Object} props
 * @param {Array<Object>} props.rooms
 * @param {boolean} props.loading
 * @param {Function} props.onEdit
 * @param {Function} props.onDelete
 * @param {Function} props.onAddFirstRoom
 * @param {Function} [props.onUpdateLocalState]
 * @returns {JSX.Element}
 */
const PhysicalRoomsGrid = ({
  rooms,
  loading,
  onEdit,
  onDelete,
  onAddFirstRoom,
  onUpdateLocalState,
}) => {
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl font-light text-slate-800 mb-1 sm:mb-2 tracking-tight">
              Physical{' '}
              <span className="font-semibold text-amber-600">Rooms</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {rooms.length} rooms found
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-lg sm:shadow-xl border border-slate-200 hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-5 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                      <Bed className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-lg sm:text-xl truncate">
                        {room.roomNumber}
                      </p>
                      <p className="text-slate-500 text-xs sm:text-sm">
                        Floor {room.floor}
                      </p>
                    </div>
                  </div>
                  {/* Pushed to the right on mobile if it wraps */}
                  <div className="self-end sm:self-auto shrink-0">
                    <RoomStatusSelector
                      room={room}
                      onUpdateLocalState={onUpdateLocalState}
                    />
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button
                    onClick={() => onEdit(room)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
                  >
                    <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(room)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex justify-center items-center"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rooms.length === 0 && !loading && (
        <div className="text-center py-16 sm:py-20 px-4 bg-white rounded-2xl shadow-xl border-2 border-dashed border-slate-300">
          <Bed className="w-16 h-16 sm:w-24 sm:h-24 text-slate-300 mx-auto mb-4 sm:mb-6" />
          <p className="text-slate-500 text-base sm:text-lg mb-2">
            No physical rooms added yet
          </p>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">
            Click &quot;Add Physical Room&quot; to create the first room
          </p>
          <Button
            onClick={onAddFirstRoom}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-6 sm:px-8 py-3 rounded-xl font-semibold flex justify-center items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Room
          </Button>
        </div>
      )}
    </>
  );
};

PhysicalRoomsGrid.propTypes = {
  rooms: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddFirstRoom: PropTypes.func.isRequired,
  onUpdateLocalState: PropTypes.func,
};

export default PhysicalRoomsGrid;
