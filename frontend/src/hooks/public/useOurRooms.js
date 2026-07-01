import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';
import { useWebSocket } from '@/hooks/useWebSocket';
import { RealtimeEvents } from '@/shared/eventContract';

export const useOurRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const filters = useMemo(
    () => ({
      capacity: searchParams.get('capacity') || '',
      priceRange: searchParams.get('priceRange') || '',
      sortBy: searchParams.get('sortBy') || 'name',
      search: searchParams.get('search') || '',
      checkIn: searchParams.get('checkIn') || '',
      checkOut: searchParams.get('checkOut') || '',
    }),
    [searchParams],
  );

  const updateFilters = useCallback(
    (newFilters) => {
      setSearchParams(
        (prevParams) => {
          const params = new URLSearchParams(prevParams);
          Object.entries(newFilters).forEach(([key, value]) => {
            if (value) {
              params.set(key, value);
            } else {
              params.delete(key);
            }
          });
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const handleRoomUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  useWebSocket(RealtimeEvents.ROOM.STATUS_CHANGED, handleRoomUpdate);
  useWebSocket(RealtimeEvents.ROOM.AVAILABILITY_CHANGED, handleRoomUpdate);

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      if (rooms.length === 0) setLoading(true); 
      
      try {
        const queryParams = {
          search: filters.search,
          checkIn: filters.checkIn,
          checkOut: filters.checkOut,
        };

        const response = await apiService.roomTypes.getAll(queryParams);

        if (isMounted) {
          setRooms(response.data.data);
        }
      } catch (error) {
        logger.error('Error fetching room types:', error);
        if (isMounted) setRooms([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, [filters.checkIn, filters.checkOut, filters.search, refreshKey]);

  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => {
        const matchesCapacity =
          !filters.capacity ||
          room.maxCapacity >= parseInt(filters.capacity, 10);

        let matchesPrice = true;
        if (filters.priceRange === 'budget')
          matchesPrice = room.basePrice <= 100;
        if (filters.priceRange === 'mid')
          matchesPrice = room.basePrice > 100 && room.basePrice <= 200;
        if (filters.priceRange === 'luxury')
          matchesPrice = room.basePrice > 200;

        return matchesCapacity && matchesPrice;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price-low':
            return a.basePrice - b.basePrice;
          case 'price-high':
            return b.basePrice - a.basePrice;
          case 'capacity':
            return b.maxCapacity - a.maxCapacity;
          default:
            return a.name.localeCompare(b.name);
        }
      });
  }, [rooms, filters]);

  return { loading, filters, updateFilters, clearFilters, filteredRooms };
};