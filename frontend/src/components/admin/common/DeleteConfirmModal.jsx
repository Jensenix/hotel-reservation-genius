import PropTypes from 'prop-types';
import Modal from '@/components/ui/Modal';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, itemName }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="space-y-6">
        <p>
          Are you sure you want to delete{' '}
          <strong>{itemName || 'this item'}</strong>?
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

DeleteConfirmModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemName: PropTypes.string,
};