import Button from '@/components/ui/Button';
import { Bed, Edit, Trash2, Plus } from 'lucide-react';
import PropTypes from 'prop-types';

const PhysicalRoomsGrid = ({
  rooms,
  loading,
  onEdit,
  onDelete,
  onAddFirstRoom,
}) => {
  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-light text-slate-800 mb-2 tracking-tight">
              Physical{' '}
              <span className="font-semibold text-amber-600">Rooms</span>
            </h2>
            <p className="text-slate-500 text-sm">{rooms.length} rooms found</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Bed className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xl">
                        {room.roomNumber}
                      </p>
                      <p className="text-slate-500 text-sm">
                        Floor {room.floor}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => onEdit(room)}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 px-4 py-2 text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => onDelete(room)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-4 py-2 text-sm rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rooms.length === 0 && !loading && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-xl border-2 border-dashed border-slate-300">
          <Bed className="w-24 h-24 text-slate-300 mx-auto mb-6" />
          <p className="text-slate-500 text-lg mb-2">
            No physical rooms added yet
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Click &quot;Add Physical Room&quot; to create the first room
          </p>
          <Button
            onClick={onAddFirstRoom}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold"
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
};

export default PhysicalRoomsGrid;
