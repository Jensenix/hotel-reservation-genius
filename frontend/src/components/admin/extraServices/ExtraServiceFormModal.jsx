import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';

export default function ExtraServiceFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onChange,
  isEditing,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Service' : 'Add Service'}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="es-serviceName" className="block text-sm font-medium text-slate-700 mb-1">
            Service Name
          </label>
          <input
            id="es-serviceName"
            required
            type="text"
            placeholder="e.g., Airport Pickup, Buffet Breakfast"
            value={formData.serviceName || ''}
            onChange={(e) => onChange('serviceName', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="es-description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="es-description"
            placeholder="Service details visible to customers"
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
            rows={3}
          />
        </div>
        <div>
          <label htmlFor="es-price" className="block text-sm font-medium text-slate-700 mb-1">
            Price ($)
          </label>
          <input
            id="es-price"
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price || ''}
            onChange={(e) => onChange('price', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="es-iconUrl" className="block text-sm font-medium text-slate-700 mb-1">
            Icon Identifier (e.g., room_service, transfer, spa)
          </label>
          <input
            id="es-iconUrl"
            type="text"
            placeholder="e.g., room_service, transfer"
            value={formData.iconUrl || ''}
            onChange={(e) => onChange('iconUrl', e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full sm:flex-1 bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

ExtraServiceFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    serviceName: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    iconUrl: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};