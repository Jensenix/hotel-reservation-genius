import React, { useState, useEffect } from 'react';
import {
  Plus,
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import apiService from '@/services/apiService';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

const PaymentMethodsManagement = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Payment Method Modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    name: '',
    type: '',
    description: '',
    isActive: true,
    config: '',
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await apiService.paymentMethods.getAll();
      console.log('API Response:', response);
      const apiData = response.data?.data || response.data || [];
      console.log('Raw API Data:', apiData);

      // Map API response to frontend format
      const mappedData = Array.isArray(apiData)
        ? apiData.map((item) => ({
            id: item.id,
            name: item.methodName || item.name || 'Unknown Payment Method',
            description: item.description || '',
            type:
              item.type || getPaymentTypeFromName(item.methodName || item.name),
            isActive: item.isActive !== false,
            config: item.accountNumber || item.config || 'N/A',
          }))
        : [];

      console.log('Mapped Payment Methods Data:', mappedData);
      setPaymentMethods(mappedData);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      // Mock data for development - always load this for now
      const mockPaymentMethods = [
        {
          id: 1,
          name: 'Credit Card',
          type: 'card',
          description: 'Visa, MasterCard, American Express',
          isActive: true,
          config: 'stripe',
        },
        {
          id: 2,
          name: 'PayPal',
          type: 'wallet',
          description: 'PayPal and PayPal Credit',
          isActive: true,
          config: 'paypal',
        },
        {
          id: 3,
          name: 'Bank Transfer',
          type: 'bank',
          description: 'Direct bank transfer and wire',
          isActive: true,
          config: 'bank',
        },
        {
          id: 4,
          name: 'Apple Pay',
          type: 'mobile',
          description: 'Apple Pay and Apple Wallet',
          isActive: true,
          config: 'apple_pay',
        },
        {
          id: 5,
          name: 'Google Pay',
          type: 'mobile',
          description: 'Google Pay and Google Wallet',
          isActive: false,
          config: 'google_pay',
        },
        {
          id: 6,
          name: 'Cash on Arrival',
          type: 'cash',
          description: 'Pay cash when you arrive',
          isActive: true,
          config: 'cash',
        },
      ];
      console.log('Using mock payment methods:', mockPaymentMethods);
      setPaymentMethods(mockPaymentMethods);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine payment type from name
  const getPaymentTypeFromName = (name) => {
    if (!name) return 'card';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('credit') || lowerName.includes('debit'))
      return 'card';
    if (lowerName.includes('paypal') || lowerName.includes('wallet'))
      return 'wallet';
    if (lowerName.includes('bank') || lowerName.includes('transfer'))
      return 'bank';
    if (
      lowerName.includes('apple') ||
      lowerName.includes('google') ||
      lowerName.includes('digital')
    )
      return 'mobile';
    if (lowerName.includes('cash')) return 'cash';
    return 'card';
  };

  const handleOpenPaymentModal = (payment = null) => {
    if (payment) {
      setEditingPayment(payment);
      setPaymentFormData({
        name: payment.name,
        type: payment.type || '',
        description: payment.description || '',
        isActive: payment.isActive !== false,
        config: payment.config || '',
      });
    } else {
      setEditingPayment(null);
      setPaymentFormData({
        name: '',
        type: '',
        description: '',
        isActive: true,
        config: '',
      });
    }
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setEditingPayment(null);
    setPaymentFormData({
      name: '',
      type: '',
      description: '',
      isActive: true,
      config: '',
    });
  };

  const handleDeleteClick = (payment) => {
    setDeleteTarget(payment);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await apiService.paymentMethods.update(
          editingPayment.id,
          paymentFormData,
        );
      } else {
        await apiService.paymentMethods.create(paymentFormData);
      }
      handleClosePaymentModal();
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error saving payment method:', error);
      alert(
        'Error saving payment method: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.paymentMethods.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert(
        'Error deleting payment method: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleToggleStatus = async (payment) => {
    try {
      await apiService.paymentMethods.update(payment.id, {
        ...payment,
        isActive: !payment.isActive,
      });
      fetchPaymentMethods();
    } catch (error) {
      console.error('Error toggling payment method status:', error);
    }
  };

  const filteredPaymentMethods = Array.isArray(paymentMethods)
    ? paymentMethods.filter(
        (method) =>
          method &&
          method.name &&
          method.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const getIconComponent = (type) => {
    const icons = {
      card: CreditCard,
      wallet: Wallet,
      bank: Building,
      mobile: Smartphone,
      cash: Wallet,
    };
    const Icon = icons[type] || CreditCard;
    return <Icon className="w-8 h-8 text-white" />;
  };

  const getTypeColor = (type) => {
    const colors = {
      card: 'bg-blue-100 text-blue-800 border-blue-200',
      wallet: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      bank: 'bg-slate-100 text-slate-800 border-slate-200',
      mobile: 'bg-purple-100 text-purple-800 border-purple-200',
      cash: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[type] || colors.card;
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-6 py-8">
          {/* Page Header - Luxury Style */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                    Payment Methods
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Payment{' '}
                  <span className="font-semibold text-amber-600">Methods</span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">
                  Manage Payment Options & Gateways
                </p>
              </div>
              <button
                onClick={() => handleOpenPaymentModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Payment Method
              </button>
            </div>
          </div>

          {/* Stats Cards - Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-amber-500/20 rounded-2xl">
                    <CreditCard className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Total Methods
                </p>
                <p className="text-4xl font-light">{paymentMethods.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-emerald-300 text-xs uppercase tracking-wider mb-2">
                  Active Methods
                </p>
                <p className="text-4xl font-light">
                  {paymentMethods.filter((pm) => pm.isActive).length}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-2xl">
                    <Smartphone className="w-8 h-8 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Digital
                  </span>
                </div>
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">
                  Digital Payments
                </p>
                <p className="text-4xl font-light">
                  {
                    paymentMethods.filter((pm) =>
                      ['card', 'wallet', 'mobile'].includes(pm.type),
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Search Section - Elegant */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search payment methods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Payment Methods Grid - Luxury */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPaymentMethods.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                          {getIconComponent(payment.type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          {payment.isActive ? (
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              <span className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                                Active
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <AlertCircle className="w-5 h-5 text-red-400" />
                              <span className="text-red-400 text-xs font-semibold uppercase tracking-wider">
                                Inactive
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-2 tracking-tight">
                        {payment.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(payment.type)}`}
                        >
                          {payment.type}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {payment.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenPaymentModal(payment)}
                        className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Edit Payment Method"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(payment)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Delete Payment Method"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPaymentMethods.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                  <CreditCard className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-lg mb-4">
                    No payment methods found
                  </p>
                  <button
                    onClick={() => handleOpenPaymentModal()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Payment Method
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Payment Method Modal */}
        <Modal
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          title={
            editingPayment ? 'Edit Payment Method' : 'Add New Payment Method'
          }
        >
          <form onSubmit={handleSubmitPayment} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Payment Method Name
              </label>
              <input
                type="text"
                required
                value={paymentFormData.name}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., Credit Card"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Type
              </label>
              <select
                required
                value={paymentFormData.type}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    type: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
              >
                <option value="">Select type</option>
                <option value="card">Credit Card</option>
                <option value="wallet">Digital Wallet</option>
                <option value="bank">Bank Transfer</option>
                <option value="mobile">Mobile Payment</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Description
              </label>
              <textarea
                value={paymentFormData.description}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="Describe the payment method..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Configuration
              </label>
              <input
                type="text"
                value={paymentFormData.config}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    config: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., stripe, paypal, bank"
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={paymentFormData.isActive}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    isActive: e.target.checked,
                  })
                }
                className="w-4 h-4 text-amber-600 border-2 border-slate-300 rounded focus:ring-2 focus:ring-amber-500"
              />
              <label
                htmlFor="isActive"
                className="text-sm font-medium text-slate-700"
              >
                Active (enabled for use)
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleClosePaymentModal}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                {editingPayment
                  ? 'Update Payment Method'
                  : 'Add Payment Method'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          title="Delete Payment Method"
        >
          <div className="space-y-6">
            <p className="text-slate-600">
              Are you sure you want to delete{' '}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Delete Payment Method
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default PaymentMethodsManagement;
