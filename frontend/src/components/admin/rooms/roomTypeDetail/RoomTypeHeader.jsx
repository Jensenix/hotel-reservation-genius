import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { ArrowLeft, Plus, Layers, Bed, DollarSign, Users } from 'lucide-react';
import PropTypes from 'prop-types';

const RoomTypeHeader = ({ roomType, roomsCount, onAddRoom }) => {
  return (
    <>
      <div className="mb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin/rooms">
              <Button className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white border-0 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                  Room Type Details
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
              <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                {roomType.name}
              </h1>
              <p className="text-slate-500 text-sm tracking-wide">
                Physical Rooms Management
              </p>
            </div>
          </div>
          <Button
            onClick={() => onAddRoom()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Physical Room
          </Button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-8 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                <Layers className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Room Type
                </p>
                <p className="text-2xl font-light">{roomType.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-emerald-400">
                <Bed className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Physical Rooms
                </p>
                <p className="text-2xl font-light">{roomsCount}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-blue-400">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Base Price
                </p>
                <p className="text-2xl font-light">
                  ${roomType.basePrice}/night
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-purple-400">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-1">
                  Max Capacity
                </p>
                <p className="text-2xl font-light">
                  {roomType.maxCapacity} guests
                </p>
              </div>
            </div>
          </div>

          {roomType.description && (
            <div className="mt-8 pt-8 border-t border-slate-700">
              <p className="text-slate-300 leading-relaxed">
                {roomType.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

RoomTypeHeader.propTypes = {
  roomType: PropTypes.shape({
    name: PropTypes.string.isRequired,
    basePrice: PropTypes.number.isRequired,
    maxCapacity: PropTypes.number.isRequired,
    description: PropTypes.string,
  }).isRequired,
  roomsCount: PropTypes.number.isRequired,
  onAddRoom: PropTypes.func.isRequired,
};

export default RoomTypeHeader;
