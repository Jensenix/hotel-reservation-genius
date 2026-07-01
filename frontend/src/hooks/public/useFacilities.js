import { useState, useEffect } from 'react';
import apiService from '@/services/api/apiService';
import { logger } from '@/config';

/**
 * @returns {{
 *   facilities: Array<Object>,
 *   loading: boolean,
 *   selectedFacility: Object|null,
 *   setSelectedFacility: Function
 * }}
 */
export const useFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true); // Initialized as true
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    let ignore = false;

    const initialFetch = async () => {
      try {
        const response = await apiService.facilities.getAll();
        if (!ignore) {
          setFacilities(response.data.data || []);
        }
      } catch (error) {
        if (!ignore) {
          logger.error('Error fetching facilities:', error);
          setFacilities([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    initialFetch();

    return () => {
      ignore = true;
    };
  }, []); // Runs strictly once on mount

  return {
    facilities,
    loading,
    selectedFacility,
    setSelectedFacility,
  };
};
