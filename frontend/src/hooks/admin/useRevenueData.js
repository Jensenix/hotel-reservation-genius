import { useState, useEffect, useCallback } from 'react';
import apiService from '@/services/api/apiService';

export const useRevenueData = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  const fetchRevenueData = useCallback(async (currentDateRange) => {
    try {
      const params = {};

      if (currentDateRange.startDate) {
        params.startDate =
          currentDateRange.startDate.toLocaleDateString('en-CA');
      }

      if (currentDateRange.endDate) {
        params.endDate = currentDateRange.endDate.toLocaleDateString('en-CA');
      }

      const response = await apiService.revenue.getStats(params);

      if (response.data.success) {
        setRevenueData(response.data.data);
      } else {
        console.error('Error fetching revenue data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      const initialDateRange = {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(),
      };

      await fetchRevenueData(initialDateRange);
    };

    loadInitialData();
  }, [fetchRevenueData]);

  const handleApplyFilter = async () => {
    setLoading(true);
    await fetchRevenueData(dateRange);
  };

  return {
    revenueData,
    loading,
    dateRange,
    setDateRange,
    handleApplyFilter,
  };
};
