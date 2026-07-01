import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onSubmit
 * @param {Object} props.formData
 * @param {string} [props.formData.methodName]
 * @param {string} [props.formData.type]
 * @param {string} [props.formData.description]
 * @param {boolean} [props.formData.isActive]
 * @param {string} [props.formData.accountNumber]
 * @param {string} [props.formData.address]
 * @param {Function} props.onChange
 * @param {boolean} props.isEditing
 * @returns {JSX.Element}
 */
export default function PaymentMethodFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEditing,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Payment Method' : 'Add Payment Method'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="pm-methodName"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
          >
            Method Name
          </label>
          <input
            id="pm-methodName"
            required
            type="text"
            placeholder="e.g., Bank Transfer, Stripe Gateway"
            value={formData.methodName || ''}
            onChange={(e) => onChange('methodName', e.target.value)}
            className="w-full px-3 py-3 sm:px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label
            htmlFor="pm-type"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
          >
            Type
          </label>
          <select
            id="pm-type"
            required
            value={formData.type || 'card'}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-3 py-3 sm:px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 bg-white text-sm sm:text-base"
          >
            <option value="card">Credit Card</option>
            <option value="wallet">Digital Wallet</option>
            <option value="bank">Bank Transfer</option>
            <option value="mobile">Mobile</option>
            <option value="cash">Cash</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="pm-description"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
          >
            Description
          </label>
          <textarea
            id="pm-description"
            placeholder="Payment instructions displayed to users"
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full px-3 py-3 sm:px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm sm:text-base"
            rows={3}
          />
        </div>
        <div>
          <label
            htmlFor="pm-accountNumber"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
          >
            Account Number
          </label>
          <input
            id="pm-accountNumber"
            type="text"
            placeholder="e.g., 123-456-7890"
            value={formData.accountNumber || ''}
            onChange={(e) => onChange('accountNumber', e.target.value)}
            className="w-full px-3 py-3 sm:px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
          />
        </div>
        <div>
          <label
            htmlFor="pm-address"
            className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1"
          >
            Billing Address / Instructions
          </label>
          <textarea
            id="pm-address"
            placeholder="Enter merchant physical address or explicit transfer wiring details"
            value={formData.address || ''}
            onChange={(e) => onChange('address', e.target.value)}
            className="w-full px-3 py-3 sm:px-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none text-sm sm:text-base"
            rows={2}
          />
        </div>
        <label className="flex items-center space-x-2 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => onChange('isActive', e.target.checked)}
            className="w-5 h-5 text-amber-500 rounded"
          />
          <span className="text-sm font-medium text-slate-700">
            Enable this method
          </span>
        </label>
        {/* Buttons - Made Responsive */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors shadow-sm"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

PaymentMethodFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    methodName: PropTypes.string,
    type: PropTypes.string,
    description: PropTypes.string,
    isActive: PropTypes.bool,
    accountNumber: PropTypes.string,
    address: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};
