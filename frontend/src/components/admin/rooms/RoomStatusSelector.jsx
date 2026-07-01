import { useState } from 'react';
import PropTypes from 'prop-types';
import apiService from '@/services/api/apiService';
import { getStatusColor } from '@/utils/availabilityUtils';

const RoomStatusSelector = ({ room, onUpdateLocalState }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (newStatus === room.status) return;

    setIsUpdating(true);
    try {
      await apiService.rooms.updateStatus(room.id, newStatus);
      
      if (onUpdateLocalState) {
        onUpdateLocalState(room.id, newStatus);
      }
    } catch (error) {
      console.error('Failed to update status', error);
      alert(error.response?.data?.message || 'Could not update room status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-block shrink-0">
      <select
        value={room.status}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`appearance-none cursor-pointer pl-3 sm:pl-4 pr-9 sm:pr-8 py-2 sm:py-1.5 rounded-lg sm:rounded-full text-sm sm:text-xs font-bold sm:font-semibold border-2 border-transparent hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${getStatusColor(room.status)} ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
        <option value="cleaning">Cleaning</option>
      </select>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 sm:px-2">
        <svg className="w-4 h-4 sm:w-3 sm:h-3 text-current opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

RoomStatusSelector.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateLocalState: PropTypes.func,
};

export default RoomStatusSelector;