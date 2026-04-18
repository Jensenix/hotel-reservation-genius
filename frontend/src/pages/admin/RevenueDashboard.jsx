import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/ui/Loading';
import AdminLayout from '../../components/layout/AdminLayout';
import { apiService } from '../../services/api';

const RevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters as object
      const params = {};
      if (dateRange.startDate) {
        params.startDate = dateRange.startDate.toLocaleDateString('en-CA');
      }
      if (dateRange.endDate) {
        params.endDate = dateRange.endDate.toLocaleDateString('en-CA');
      }
      
      console.log('Fetching revenue data with params:', params);
      const response = await apiService.getRevenueStats(params);
      
      if (response.data.success) {
        console.log('Revenue data received:', response.data.data);
        console.log('Revenue by room type:', response.data.data.revenueByRoomType);
        setRevenueData(response.data.data);
      } else {
        console.error('Error fetching revenue data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('id-ID').format(new Date(date));
  };

  if (loading || !revenueData) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loading size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Revenue Dashboard</h1>
        <p className="text-slate-600">Monitor hotel financial performance and analytics</p>
      </div>

      {/* Date Range Filter */}
      <Card className="mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Start Date
            </label>
            <input
              type="date"
              value={dateRange.startDate.toLocaleDateString('en-CA')}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment End Date
            </label>
            <input
              type="date"
              value={dateRange.endDate.toLocaleDateString('en-CA')}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button onClick={fetchRevenueData}>
            Apply Filter
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">{formatCurrency(revenueData.totalRevenue)}</p>
              </div>
              <div className="p-3 bg-blue-700 bg-opacity-50 rounded-lg">
                <svg className="w-6 h-6 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Bookings</p>
                <p className="text-3xl font-bold">{revenueData.totalBookings}</p>
              </div>
              <div className="p-3 bg-purple-700 bg-opacity-50 rounded-lg">
                <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Top Room Type</p>
                <p className="text-3xl font-bold">{revenueData.revenueByRoomType?.[0]?.type || 'N/A'}</p>
                <p className="text-sm text-orange-200 mt-1">{formatCurrency(revenueData.revenueByRoomType?.[0]?.revenue || 0)}</p>
              </div>
              <div className="p-3 bg-orange-700 bg-opacity-50 rounded-lg">
                <svg className="w-6 h-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue Chart */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Monthly Revenue Trend</h3>
            <p className="text-sm text-slate-600 mb-4">Revenue distribution by month (from payment date range)</p>
            <div className="space-y-3">
              {revenueData.revenueByMonth.length > 0 ? (
                revenueData.revenueByMonth.map((item, index) => {
                  const maxRevenue = Math.max(...revenueData.revenueByMonth.map(i => i.revenue));
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{item.month}</span>
                      <div className="flex items-center">
                        <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 min-w-[80px] text-right">
                          {formatCurrency(item.revenue)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No revenue data available for selected payment period</p>
              )}
            </div>
          </div>
        </Card>

        {/* Revenue by Room Type */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Revenue by Room Type</h3>
            <p className="text-sm text-slate-600 mb-4">Revenue breakdown by room category (from payment date range)</p>
            <div className="space-y-4">
              {revenueData.revenueByRoomType && revenueData.revenueByRoomType.length > 0 ? (
                revenueData.revenueByRoomType.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">{item.type}</p>
                    <p className="text-sm text-slate-600">{item.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{formatCurrency(item.revenue)}</p>
                    <p className="text-sm text-slate-600">
                      {item.bookings > 0 ? formatCurrency(Math.round(item.revenue / item.bookings)) : formatCurrency(0)} avg
                    </p>
                  </div>
                </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500 mb-2">No room type revenue data available</p>
                    <p className="text-xs text-slate-400">Try adjusting the payment date range or check if there are paid bookings</p>
                  </div>
                )}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Transactions (by Payment Date)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Payment Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {revenueData.recentTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                      #{transaction.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {transaction.guest}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        transaction.status === 'paid' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {formatDate(transaction.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
      </div>
    </AdminLayout>
  );
};

export default RevenueDashboard;
