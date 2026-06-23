import { useState, useEffect } from 'react';
import apiService from '@/services/apiService';

export const useFeaturedRooms = (limit = 3) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await apiService.roomTypes.getAll();
        if (isMounted) {
          setRooms(response.data.data.slice(0, limit));
        }
      } catch (err) {
        if (isMounted) setError(err);
        console.error('Error fetching featured rooms:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return { rooms, loading, error };
};