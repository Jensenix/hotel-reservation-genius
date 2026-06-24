import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/apiService';
import { dateToString } from '@/utils/availabilityUtils';

export const useRoomAvailability = () => {
  const [availabilityData, setAvailabilityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expandedRoomType, setExpandedRoomType] = useState(null);

  const fetchAvailabilityData = useCallback(async (date) => {
    try {
      const dateString = dateToString(date);
      const response = await apiService.roomAvailability.getStats({
        date: dateString,
      });

      if (response.data.success) {
        setAvailabilityData(response.data.data);
      } else {
        console.error('Error fetching availability data:', response.data.message);
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