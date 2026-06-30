import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

export const useOurRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    let isMounted = true;

    const loadRooms = async () => {
      setLoading(true); // Moved inside the async function to avoid synchronous effect renders
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
  }, [filters.checkIn, filters.checkOut, filters.search]);

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
