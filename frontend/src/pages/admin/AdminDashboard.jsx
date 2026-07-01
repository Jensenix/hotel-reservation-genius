import AdminLayout from '@/layouts/AdminLayout';
import { useAdminBooking } from '@/hooks/admin/useAdminBooking';

import BookingFilterBar from '@/components/admin/bookings/BookingFilterBar';
import BookingTable from '@/components/admin/bookings/BookingTable';
import BookingsPagination from '@/components/admin/bookings/BookingPagination';
import BookingActionModal from '@/components/admin/bookings/BookingActionModal';
import BookingDetailModal from '@/components/admin/bookings/BookingDetailModal';

/**
 * @param {string} status
 * @returns {JSX.Element}
 */
const AdminDashboard = () => {
  const { state, refs, actions } = useAdminBooking();

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      'checked-in': 'bg-green-100 text-green-800',
      'checked-out': 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  if (state.loading && state.bookings.length === 0) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8 mx-auto"></div>
            <div className="h-96 bg-gray-300 rounded-xl w-full max-w-4xl"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
                  Admin{' '}
                  <span className="font-semibold text-amber-600">
                    Dashboard
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide uppercase">
                  Booking Management & Operations
                </p>
              </div>
            </div>
          </div>

          <BookingFilterBar
            filters={state.filters}
            handleFilterChange={actions.handleFilterChange}
            fetchBookings={actions.fetchBookings}
            searchInputRef={refs.searchInputRef}
          />

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-1">
                Bookings Management
              </h3>
              <p className="text-sm text-slate-500">
                Manage and monitor all hotel bookings
              </p>
            </div>

            <BookingTable
              bookings={state.bookings}
              getStatusBadge={getStatusBadge}
              onViewDetails={actions.fetchBookingDetails}
              onAction={(booking, type) => {
                actions.setSelectedBooking(booking);
                actions.setActionType(type);
                actions.setShowActionModal(true);
              }}
            />

            <BookingsPagination
              pagination={state.pagination}
              filters={state.filters}
              handleFilterChange={actions.handleFilterChange}
            />
          </div>

          <BookingActionModal
            isOpen={state.showActionModal}
            onClose={() => actions.setShowActionModal(false)}
            actionType={state.actionType}
            selectedBooking={state.selectedBooking}
            cancelReason={state.cancelReason}
            setCancelReason={actions.setCancelReason}
            executeAction={actions.executeAction}
          />

          <BookingDetailModal
            isOpen={state.showDetailModal}
            onClose={() => {
              actions.setShowDetailModal(false);
              actions.setBookingDetails(null);
            }}
            selectedBooking={state.selectedBooking}
            bookingDetails={state.bookingDetails}
            loadingDetails={state.loadingDetails}
            getStatusBadge={getStatusBadge}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
