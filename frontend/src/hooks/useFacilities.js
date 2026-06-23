import { useState, useEffect } from 'react';
import apiService from '@/services/apiService';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true); // Initialized as true
  const [selectedFacility, setSelectedFacility] = useState(null);

  useEffect(() => {
    let ignore = false;

    const initialFetch = async () => {
      try {
        // No synchronous setLoading(true) here!
        const response = await apiService.facilities.getAll();
        if (!ignore) {
          setFacilities(response.data.data || []);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Error fetching facilities:', error);
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