import { useState, useEffect } from 'react';
import Button from '@/components/common/Button';
import Loading from '@/components/ui/Loading';
import AdminLayout from '@/components/layout/AdminLayout';
import apiService from '@/services/apiService';

const RevenueDashboard = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });

  useEffect(() => {
    fetchRevenueData();
  }, [dateRange]);

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
      const response = await apiService.revenue.getStats(params);

      if (response.data.success) {
        console.log('Revenue data received:', response.data.data);
        console.log(
          'Revenue by room type:',
          response.data.data.revenueByRoomType,
        );
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
      currency: 'USD',
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with elegant styling */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
                  Revenue{' '}
                  <span className="font-semibold text-amber-600">
                    Dashboard
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide uppercase">
                  Financial Performance & Analytics
                </p>
              </div>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                <span className="text-amber-600 text-xs font-semibold tracking-widest">
                  GENIUS SOCIETY HOTEL
                </span>
                <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
              </div>
            </div>
          </div>

          {/* Date Range Filter - Elegant Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <div className="flex flex-wrap gap-6 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Payment Start Date
                </label>
                <input
                  type="date"
                  value={dateRange.startDate.toLocaleDateString('en-CA')}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      startDate: new Date(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Payment End Date
                </label>
                <input
                  type="date"
                  value={dateRange.endDate.toLocaleDateString('en-CA')}
                  onChange={(e) =>
                    setDateRange((prev) => ({
                      ...prev,
                      endDate: new Date(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-slate-700 bg-slate-50 focus:bg-white"
                />
              </div>
              <div>
                <Button
                  onClick={fetchRevenueData}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200 border-0"
                >
                  Apply Filter
                </Button>
              </div>
            </div>
          </div>

          {/* Key Metrics - Elegant Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Total Revenue - Navy with Gold Accent */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/20 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08.402-2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Total Revenue
                </p>
                <p className="text-3xl font-light text-white">
                  {formatCurrency(revenueData.totalRevenue)}
                </p>
              </div>
            </div>

            {/* Total Bookings - Elegant Navy */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-lg p-6 border border-slate-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-amber-500/10 rounded-lg">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Bookings
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                  Total Bookings
                </p>
                <p className="text-3xl font-light text-white">
                  {revenueData.totalBookings}
                </p>
              </div>
            </div>

            {/* Top Room Type - Gold Accent */}
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl shadow-lg p-6 border border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white/20 rounded-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">
                    Top
                  </span>
                </div>
                <p className="text-amber-100 text-xs uppercase tracking-wider mb-1">
                  Top Room Type
                </p>
                <p className="text-2xl font-semibold text-white mb-1">
                  {revenueData.revenueByRoomType?.[0]?.type || 'N/A'}
                </p>
                <p className="text-sm text-amber-100">
                  {formatCurrency(
                    revenueData.revenueByRoomType?.[0]?.revenue || 0,
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Monthly Revenue Trend
                </h3>
                <p className="text-sm text-slate-500">
                  Revenue distribution by month (from payment date range)
                </p>
              </div>
              <div className="space-y-3">
                {revenueData.revenueByMonth.length > 0 ? (
                  revenueData.revenueByMonth.map((item, index) => {
                    const maxRevenue = Math.max(
                      ...revenueData.revenueByMonth.map((i) => i.revenue),
                    );
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {item.month}
                        </span>
                        <div className="flex items-center">
                          <div className="w-24 bg-slate-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%`,
                              }}
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
                  <p className="text-sm text-slate-500 text-center py-4">
                    No revenue data available for selected payment period
                  </p>
                )}
              </div>
            </div>

            {/* Revenue by Room Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Revenue by Room Type
                </h3>
                <p className="text-sm text-slate-500">
                  Revenue breakdown by room category (from payment date range)
                </p>
              </div>
              <div className="space-y-3">
                {revenueData.revenueByRoomType &&
                revenueData.revenueByRoomType.length > 0 ? (
                  revenueData.revenueByRoomType.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white border border-slate-100 rounded-lg hover:shadow-md transition-shadow duration-200"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.type}
                        </p>
                        <p className="text-sm text-slate-500">
                          {item.bookings} bookings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">
                          {formatCurrency(item.revenue)}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.bookings > 0
                            ? formatCurrency(
                                Math.round(item.revenue / item.bookings),
                              )
                            : formatCurrency(0)}{' '}
                          avg
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-slate-500 mb-2">
                      No room type revenue data available
                    </p>
                    <p className="text-xs text-slate-400">
                      Try adjusting the payment date range or check if there are
                      paid bookings
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Recent Transactions
              </h3>
              <p className="text-sm text-slate-500">
                Latest payments (by payment date)
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Booking ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {revenueData.recentTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">
                        #{transaction.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {transaction.guest}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatDate(transaction.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RevenueDashboard;
