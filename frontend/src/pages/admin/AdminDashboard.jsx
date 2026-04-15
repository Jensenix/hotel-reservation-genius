import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin bookings with filters:', filters);
      const response = await apiService.getAdminBookings(filters);
      console.log('Admin bookings response:', response.data);
      
      if (response.data.success) {
        setBookings(response.data.data.bookings);
        setPagination(response.data.data.pagination);
        console.log('Bookings loaded:', response.data.data.bookings.length);
      } else {
        console.error('API returned error:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching admin bookings:', error);
      console.error('Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleAction = (booking, action) => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowActionModal(true);
  };

  const executeAction = async () => {
    try {
      let response;
      const bookingId = selectedBooking.id;

      switch (actionType) {
        case 'confirm':
          response = await apiService.confirmBooking(bookingId);
          break;
        case 'check-in':
          response = await apiService.checkInGuest(bookingId);
          break;
        case 'check-out':
          response = await apiService.checkOutGuest(bookingId);
          break;
        case 'cancel':
          response = await apiService.cancelBooking(bookingId, { reason: cancelReason });
          break;
        default:
          return;
      }

      if (response.data.success) {
        setShowActionModal(false);
        setSelectedBooking(null);
        setCancelReason('');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      checked_in: 'bg-green-100 text-green-800',
      checked_out: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const getActionButtons = (booking) => {
    const buttons = [];

    if (booking.status === 'pending') {
      buttons.push(
        <Button
          key="confirm"
          size="sm"
          onClick={() => handleAction(booking, 'confirm')}
          className="mr-2"
        >
          Confirm
        </Button>,
        <Button
          key="cancel"
          size="sm"
          variant="outline"
          onClick={() => handleAction(booking, 'cancel')}
        >
          Cancel
        </Button>
      );
    } else if (booking.status === 'confirmed') {
      buttons.push(
        <Button
          key="check-in"
          size="sm"
          onClick={() => handleAction(booking, 'check-in')}
        >
          Check In
        </Button>
      );
    } else if (booking.status === 'checked_in') {
      buttons.push(
        <Button
          key="check-out"
          size="sm"
          onClick={() => handleAction(booking, 'check-out')}
        >
          Check Out
        </Button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-8"></div>
            <div className="h-96 bg-gray-300 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and hotel operations</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Filter
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Per Page
              </label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Bookings Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.user?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.user?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {booking.room?.roomNumber}
                        </div>
                        <div className="text-sm text-gray-500">
                          {booking.room?.roomType?.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(booking.checkInDate).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {new Date(booking.checkOutDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {getActionButtons(booking)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Action Modal */}
        <Modal
          isOpen={showActionModal}
          onClose={() => setShowActionModal(false)}
          title={`${actionType.charAt(0).toUpperCase() + actionType.slice(1).replace('-', ' ')} Booking #${selectedBooking?.id}`}
        >
          <div className="space-y-4">
            {actionType === 'cancel' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cancel Reason
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter reason for cancellation..."
                />
              </div>
            ) : (
              <div>
                <p className="text-gray-600">
                  Are you sure you want to {actionType.replace('-', ' ')} this booking?
                </p>
                {selectedBooking && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm">
                      <div className="font-medium">Guest: {selectedBooking.user?.fullName}</div>
                      <div>Room: {selectedBooking.room?.roomNumber}</div>
                      <div>Dates: {new Date(selectedBooking.checkInDate).toLocaleDateString()} - {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</div>
                      <div>Total: ${selectedBooking.totalPrice}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowActionModal(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={executeAction}
                disabled={actionType === 'cancel' && !cancelReason.trim()}
              >
                {actionType.charAt(0).toUpperCase() + actionType.slice(1).replace('-', ' ')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;
