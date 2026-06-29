import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api/apiService';
import { useWebSocket } from '@/hooks/useWebSocket';

export const useRoomAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedRoomType, setExpandedRoomType] = useState(null);

  const fetchAvailabilityData = useCallback(async (date) => {
    try {
      setLoading(true);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const response = await apiService.roomAvailability.getAvailability({
        date: dateString,
      });

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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (isMounted) {
        await fetchAvailabilityData(selectedDate);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedDate, fetchAvailabilityData]);

  // ---------------------------------------------------------------------------
  // Real-time Event Subscription
  // ---------------------------------------------------------------------------
  // Helper to compute new availability state based on payload
  const computeNewAvailabilityState = (prev, payload) => {
    if (!prev) return prev;

    let hasChanges = false;
    let oldStatus = null;

    const newByRoomType = prev.byRoomType.map((roomType) => {
      const roomIndex = roomType.rooms.findIndex(
        (r) => String(r.id) === String(payload.roomId),
      );

      if (roomIndex === -1) return roomType;

      oldStatus = roomType.rooms[roomIndex].status;
      if (oldStatus === payload.status) return roomType;

      hasChanges = true;

      const newRooms = [...roomType.rooms];
      newRooms[roomIndex] = { ...newRooms[roomIndex], status: payload.status };

      const newRoomType = { ...roomType, rooms: newRooms };
      if (newRoomType[`${oldStatus}Rooms`] !== undefined) {
        newRoomType[`${oldStatus}Rooms`]--;
      }
      if (newRoomType[`${payload.status}Rooms`] !== undefined) {
        newRoomType[`${payload.status}Rooms`]++;
      }

      return newRoomType;
    });

    if (!hasChanges) return prev;

    const newOverall = { ...prev.overall };
    if (newOverall[`${oldStatus}Rooms`] !== undefined) {
      newOverall[`${oldStatus}Rooms`]--;
    }
    if (newOverall[`${payload.status}Rooms`] !== undefined) {
      newOverall[`${payload.status}Rooms`]++;
    }

    if (newOverall.totalRooms > 0) {
      newOverall.availabilityRate = Math.round(
        (newOverall.availableRooms / newOverall.totalRooms) * 100,
      );
      newOverall.occupancyRate = Math.round(
        (newOverall.occupiedRooms / newOverall.totalRooms) * 100,
      );
    }

    return {
      ...prev,
      overall: newOverall,
      byRoomType: newByRoomType,
    };
  };

  const handleAvailabilityChanged = (payload) => {
    if (!payload || !payload.roomId || !payload.status) return;
    setAvailabilityData((prev) => computeNewAvailabilityState(prev, payload));
  };

  useWebSocket('room:availability_changed', handleAvailabilityChanged);

  const toggleRoomTypeDetails = useCallback((roomTypeId) => {
    setExpandedRoomType((prev) => (prev === roomTypeId ? null : roomTypeId));
  }, []);

  const setToday = useCallback(() => {
    setSelectedDate(new Date());
  }, []);

  return {
    availabilityData,
    loading,
    selectedDate,
    setSelectedDate,
    expandedRoomType,
    toggleRoomTypeDetails,
    setToday,
  };
};
