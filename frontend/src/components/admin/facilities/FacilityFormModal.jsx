import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';

export default function FacilityFormModal({
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
      title={isEditing ? 'Edit Facility' : 'Add Facility'}
    >
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="fm-facilityName" className="block text-sm font-medium text-slate-700 mb-2">
            Facility Name
          </label>
          <input
            id="fm-facilityName"
            type="text"
            required
            value={formData.facilityName || ''}
            onChange={(e) => onChange('facilityName', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div>
          <label htmlFor="fm-iconUrl" className="block text-sm font-medium text-slate-700 mb-2">
            Icon URL
          </label>
          <input
            id="fm-iconUrl"
            type="text"
            value={formData.iconUrl || ''}
            onChange={(e) => onChange('iconUrl', e.target.value)}
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-500 text-white py-3 rounded-xl font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-semibold"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

FacilityFormModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    facilityName: PropTypes.string,
    iconUrl: PropTypes.string,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
};