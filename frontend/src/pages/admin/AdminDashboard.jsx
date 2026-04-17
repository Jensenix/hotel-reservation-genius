import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import AdminLayout from '../../components/layout/AdminLayout';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({});
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [filters.status, filters.page, filters.limit]);

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
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Only reset page when changing filters other than page
      if (key !== 'page') {
        newFilters.page = 1;
      }
      return newFilters;
    });
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

  const handleViewDetails = async (booking) => {
    try {
      setLoadingDetails(true);
      setSelectedBooking(booking);
      setShowDetailModal(true);
      
      // Fetch booking details (includes extra services with through table data)
      const bookingResponse = await apiService.getBookingById(booking.id);
      const bookingData = bookingResponse.data.data;
      
      setBookingDetails(bookingData);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoadingDetails(false);
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
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and hotel operations</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Booking
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Search by Booking ID..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      fetchBookings();
                    }
                  }}
                />
                <Button
                  onClick={fetchBookings}
                  className="px-4"
                >
                  Search
                </Button>
                {filters.search && (
                  <Button
                    variant="outline"
                    onClick={() => handleFilterChange('search', '')}
                    className="px-4"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
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
                  <tr 
                    key={booking.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleViewDetails(booking)}
                  >
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
                      <div onClick={(e) => e.stopPropagation()}>
                        {getActionButtons(booking)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-700">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pagination.currentPage === pageNum ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleFilterChange('page', pageNum)}
                        className="min-w-[40px]"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
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

        {/* Detail Modal */}
        <Modal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setBookingDetails(null);
          }}
          title={`Booking Details #${selectedBooking?.id}`}
          size="lg"
        >
          {loadingDetails ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading booking details...</p>
            </div>
          ) : bookingDetails ? (
            <div className="space-y-4">
              {/* Guest & Room Info - Combined */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Guest Information</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-medium text-gray-900">{bookingDetails.user?.fullName || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Email</div>
                      <div className="text-sm text-gray-700">{bookingDetails.user?.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Room Information</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="text-xs text-gray-500">Room Number</div>
                      <div className="font-medium text-gray-900">{bookingDetails.room?.roomNumber || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Room Type</div>
                      <div className="text-sm text-gray-700">{bookingDetails.room?.roomType?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Max Guests</div>
                      <div className="text-sm text-gray-700">{bookingDetails.room?.roomType?.maxCapacity || 2} Guests</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Booking Details</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-xs text-gray-500">Check-in</div>
                    <div className="font-medium text-gray-900">{new Date(bookingDetails.checkInDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Check-out</div>
                    <div className="font-medium text-gray-900">{new Date(bookingDetails.checkOutDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Status</div>
                    <div className="mt-1">{getStatusBadge(bookingDetails.status)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Total</div>
                    <div className="font-bold text-blue-600">${parseFloat(bookingDetails.totalPrice)}</div>
                  </div>
                </div>
              </div>

              {/* Extra Services */}
              {bookingDetails.extraServices && bookingDetails.extraServices.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Extra Services</h3>
                  <div className="space-y-2">
                    {bookingDetails.extraServices.map((item) => (
                      <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm">
                        <span className="font-medium text-gray-900">{item.serviceName} × {item.BookingExtraService?.quantity || 1}</span>
                        <span className="font-semibold text-gray-900">${parseFloat(item.BookingExtraService?.subtotal) || parseFloat(item.price)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
                    <span className="font-semibold text-gray-700">Services Total</span>
                    <span className="font-bold text-gray-900">
                      ${bookingDetails.extraServices.reduce((sum, item) => sum + (parseFloat(item.BookingExtraService?.subtotal) || parseFloat(item.price)), 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Special Requests */}
              {bookingDetails.specialRequests && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Special Requests</h3>
                  <p className="text-sm text-gray-700">{bookingDetails.specialRequests}</p>
                </div>
              )}

              {/* Payment Information */}
              {bookingDetails.payment && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method</span>
                      <span className="font-medium text-gray-900">{bookingDetails.payment.paymentMethod?.methodName || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount</span>
                      <span className="font-bold text-gray-900">${parseFloat(bookingDetails.payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      {getStatusBadge(bookingDetails.payment.paymentStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Time</span>
                      <span className="text-gray-700">{new Date(bookingDetails.payment.transactionTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600">
              No booking details available
            </div>
          )}
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
