import AdminLayout from '@/components/layout/AdminLayout';
import Loading from '@/components/ui/Loading';
import { useRevenueData } from '@/hooks/useRevenueData';
import RevenueHeader from '@/components/admin/revenue/RevenueHeader';
import RevenueFilter from '@/components/admin/revenue/RevenueFilter';
import RevenueMetrics from '@/components/admin/revenue/RevenueMetrics';
import RevenueCharts from '@/components/admin/revenue/RevenueCharts';
import RevenueTransactionsTable from '@/components/admin/revenue/RevenueTransactionsTable';

const RevenueDashboard = () => {
  const { 
    revenueData, 
    loading, 
    dateRange, 
    setDateRange, 
    handleApplyFilter 
  } = useRevenueData();

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
          
          <RevenueHeader />

          <RevenueFilter 
            dateRange={dateRange} 
            setDateRange={setDateRange} 
            onApplyFilter={handleApplyFilter} 
          />

          <RevenueMetrics revenueData={revenueData} />

          <RevenueCharts revenueData={revenueData} />

          <RevenueTransactionsTable transactions={revenueData.recentTransactions} />
          
        </div>
      </div>
    </AdminLayout>
  );
};

export default RevenueDashboard;