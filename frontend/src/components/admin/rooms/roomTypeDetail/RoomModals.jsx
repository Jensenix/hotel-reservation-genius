import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import PropTypes from 'prop-types';

const RoomModals = ({
  showRoomModal,
  handleCloseRoomModal,
  editingRoom,
  handleSubmitRoom,
  roomFormData,
  setRoomFormData,
  showDeleteModal,
  setShowDeleteModal,
  deletingRoom,
  setDeletingRoom,
  handleDelete,
}) => {
  return (
    <>
      <Modal
        isOpen={showRoomModal}
        onClose={handleCloseRoomModal}
        title={editingRoom ? 'Edit Physical Room' : 'Add Physical Room'}
      >
        <form onSubmit={handleSubmitRoom} className="space-y-6">
          <div>
            <label
              htmlFor="roomNumber"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Room Number
            </label>
            <input
              id="roomNumber"
              type="text"
              required
              value={roomFormData.roomNumber}
              onChange={(e) =>
                setRoomFormData({
                  ...roomFormData,
                  roomNumber: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g., A101"
            />
          </div>

          <div>
            <label
              htmlFor="floor"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Floor
            </label>
            <input
              id="floor"
              type="number"
              required
              min="1"
              value={roomFormData.floor}
              onChange={(e) =>
                setRoomFormData({ ...roomFormData, floor: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              placeholder="e.g., 1"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={handleCloseRoomModal}
              className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
            >
              {editingRoom ? 'Update Room' : 'Add Room'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingRoom(null);
        }}
        title="Delete Physical Room"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            Are you sure you want to delete room{' '}
            <strong>{deletingRoom?.roomNumber}</strong>? This action cannot be
            undone.
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                setShowDeleteModal(false);
                setDeletingRoom(null);
              }}
              className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
            >
              Delete Room
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

RoomModals.propTypes = {
  showRoomModal: PropTypes.bool.isRequired,
  handleCloseRoomModal: PropTypes.func.isRequired,
  editingRoom: PropTypes.object,
  handleSubmitRoom: PropTypes.func.isRequired,
  roomFormData: PropTypes.object.isRequired,
  setRoomFormData: PropTypes.func.isRequired,
  showDeleteModal: PropTypes.bool.isRequired,
  setShowDeleteModal: PropTypes.func.isRequired,
  deletingRoom: PropTypes.object,
  setDeletingRoom: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default RoomModals;
