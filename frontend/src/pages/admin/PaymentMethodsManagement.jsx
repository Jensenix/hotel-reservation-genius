import {
  CreditCard,
  Wallet,
  Building,
  Smartphone,
  Edit2,
  Trash2,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Modal from '@/components/ui/Modal';
import { useAdminCRUD } from '@/hooks/admin/useAdminCRUD';

export default function PaymentMethodsManagement() {
  const initialFormState = {
    methodName: '',
    type: 'card',
    description: '',
    isActive: true,
    accountNumber: '',
    address: '',
  };

  const mapApiResponse = (apiData) => {
    return Array.isArray(apiData)
      ? apiData.map((item) => ({
          id: item.id,
          methodName: item.methodName || '',
          description: item.description || '',
          type: item.type || 'card',
          isActive: item.isActive !== false,
          accountNumber: item.accountNumber || '',
          address: item.address || '',
        }))
      : [];
  };

  const { state, actions } = useAdminCRUD({
    endpoint: 'paymentMethods',
    initialFormState,
    mapApiResponse,
  });

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

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-slate-800 mb-2">
              Payment{' '}
              <span className="font-semibold text-amber-600">Methods</span>
            </h1>
            <p className="text-slate-500 text-sm">Manage Gateways & Options</p>
          </div>
          <button
            onClick={() => actions.setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Method
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search payment methods..."
            value={state.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Grid */}
        {state.loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.filteredData.map((payment) => (
              <div
                key={payment.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-slate-900 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                      {getIconComponent(payment.type)}
                    </div>
                    <span
                      className={`flex items-center px-2 py-1 rounded-md text-xs font-semibold ${payment.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      {payment.isActive ? (
                        <CheckCircle2 size={12} className="mr-1" />
                      ) : (
                        <AlertCircle size={12} className="mr-1" />
                      )}
                      {payment.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {payment.methodName}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2 mb-3">
                    {payment.description}
                  </p>

                  {/* Informational Subtext Badges */}
                  <div className="mt-2 text-xs text-slate-400 space-y-1 border-t border-slate-800 pt-2">
                    {payment.accountNumber && <div><span className="font-medium text-slate-500">Acc No:</span> {payment.accountNumber}</div>}
                    {payment.address && <div><span className="font-medium text-slate-500">Address:</span> {payment.address}</div>}
                  </div>
                </div>
                <div className="p-4 bg-white flex justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => actions.handleEdit(payment, payment)}
                    className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      actions.setDeleteTarget(payment);
                      actions.setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={state.showModal}
        onClose={actions.closeModal}
        title={state.editingItem ? 'Edit Payment Method' : 'Add Payment Method'}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="pm-methodName" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Method Name</label>
            <input
              id="pm-methodName"
              required
              type="text"
              placeholder="e.g., Bank Transfer, Stripe Gateway"
              value={state.formData.methodName || ''}
              onChange={(e) =>
                actions.setFormData({ ...state.formData, methodName: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="pm-type" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</label>
            <select
              id="pm-type"
              required
              value={state.formData.type}
              onChange={(e) =>
                actions.setFormData({ ...state.formData, type: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white"
            >
              <option value="card">Credit Card</option>
              <option value="wallet">Digital Wallet</option>
              <option value="bank">Bank Transfer</option>
              <option value="mobile">Mobile</option>
              <option value="cash">Cash</option>
            </select>
          </div>
          <div>
            <label htmlFor="pm-description" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</label>
            <textarea
              id="pm-description"
              placeholder="Payment instructions displayed to users"
              value={state.formData.description || ''}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="pm-accountNumber" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Account Number</label>
            <input
              id="pm-accountNumber"
              type="text"
              placeholder="e.g., 123-456-7890"
              value={state.formData.accountNumber || ''}
              onChange={(e) =>
                actions.setFormData({ ...state.formData, accountNumber: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="pm-address" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Billing Address / Instructions</label>
            <textarea
              id="pm-address"
              placeholder="Enter merchant physical address or explicit transfer wiring details"
              value={state.formData.address || ''}
              onChange={(e) =>
                actions.setFormData({ ...state.formData, address: e.target.value })
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
              rows={2}
            />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={state.formData.isActive}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  isActive: e.target.checked,
                })
              }
              className="w-5 h-5 text-amber-500 rounded"
            />
            <span className="text-sm font-medium text-slate-700">
              Enable this method
            </span>
          </label>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={actions.closeModal}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600"
            >
              {state.editingItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={state.showDeleteModal}
        onClose={actions.closeDeleteModal}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <p>
            Are you sure you want to delete{' '}
            <strong>{state.deleteTarget?.methodName}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={actions.closeDeleteModal}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}