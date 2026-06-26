import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';

const RoomTypeModals = ({
  showRoomTypeModal,
  handleCloseRoomTypeModal,
  editingRoomType,
  handleSubmitRoomType,
  roomTypeFormData,
  setRoomTypeFormData,
  showDeleteModal,
  setShowDeleteModal,
  deleteTarget,
  setDeleteTarget,
  handleDelete,
}) => {
  return (
    <>
      <Modal
        isOpen={showRoomTypeModal}
        onClose={handleCloseRoomTypeModal}
        title={editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
      >
        <form onSubmit={handleSubmitRoomType} className="space-y-4 sm:space-y-6">
          <div>
            <label
              htmlFor="roomTypeName"
              className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2"
            >
              Room Type Name
            </label>
            <input
              id="roomTypeName"
              type="text"
              required
              value={roomTypeFormData.name}
              onChange={(e) =>
                setRoomTypeFormData({
                  ...roomTypeFormData,
                  name: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g., Standard Room"
            />
          </div>

          <div>
            <label
              htmlFor="roomTypeDescription"
              className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2"
            >
              Description
            </label>
            <textarea
              id="roomTypeDescription"
              value={roomTypeFormData.description}
              onChange={(e) =>
                setRoomTypeFormData({
                  ...roomTypeFormData,
                  description: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="Describe the room type..."
              rows={3}
            />
          </div>

          <div>
            <label
              htmlFor="roomTypeBasePrice"
              className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2"
            >
              Base Price ($)
            </label>
            <input
              id="roomTypeBasePrice"
              type="number"
              required
              min="0"
              step="0.01"
              value={roomTypeFormData.basePrice}
              onChange={(e) =>
                setRoomTypeFormData({
                  ...roomTypeFormData,
                  basePrice: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g., 100"
            />
          </div>

          <div>
            <label
              htmlFor="roomTypeMaxCapacity"
              className="block text-sm font-medium text-slate-700 mb-1 sm:mb-2"
            >
              Max Capacity (Guests)
            </label>
            <input
              id="roomTypeMaxCapacity"
              type="number"
              required
              min="1"
              value={roomTypeFormData.maxCapacity}
              onChange={(e) =>
                setRoomTypeFormData({
                  ...roomTypeFormData,
                  maxCapacity: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g., 2"
            />
          </div>

          {/* Action Buttons - Stacked on Mobile */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
            <Button
              type="button"
              onClick={handleCloseRoomTypeModal}
              className="w-full sm:flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300 py-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300 py-3"
            >
              {editingRoomType ? 'Update' : 'Create Room'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeleteTarget(null);
        }}
        title="Delete Room Type"
      >
        <div className="space-y-6">
          <p className="text-slate-600 text-sm sm:text-base">
            Are you sure you want to delete{' '}
            <strong>{deleteTarget?.name}</strong>? This will also delete all
            physical rooms associated with this type. This action cannot be
            undone.
          </p>
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteTarget(null);
              }}
              className="w-full sm:flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300 py-3"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300 py-3"
            >
              Delete Type
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

RoomTypeModals.propTypes = {
  showRoomTypeModal: PropTypes.bool.isRequired,
  handleCloseRoomTypeModal: PropTypes.func.isRequired,
  editingRoomType: PropTypes.object,
  handleSubmitRoomType: PropTypes.func.isRequired,
  roomTypeFormData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    basePrice: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    maxCapacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  }).isRequired,
  setRoomTypeFormData: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.bool.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
  deleteTarget: PropTypes.object,
  setDeleteTarget: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RoomTypeModals;