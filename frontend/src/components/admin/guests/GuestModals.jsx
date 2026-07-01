import { AlertTriangle } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import PropTypes from 'prop-types';

function formatEditorNames(editors = []) {
  if (editors.length === 0) return '';

  return editors
    .map((editor) => editor.userName || `Admin ${editor.userId}`)
    .join(', ');
}

export default function GuestModals({ state, actions, handleCustomSubmit }) {
  const hasEditingWarning =
    state.editingItem &&
    Array.isArray(state.editingWarningEditors) &&
    state.editingWarningEditors.length > 0;

  const editorNames = formatEditorNames(state.editingWarningEditors || []);

  return (
    <>
      <Modal
        isOpen={state.showModal}
        onClose={actions.closeModal}
        title={state.editingItem ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          {hasEditingWarning && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />

                <div>
                  <p className="font-semibold">
                    {editorNames}{' '}
                    {state.editingWarningEditors.length === 1 ? 'is' : 'are'}{' '}
                    currently editing this user.
                  </p>

                  <p className="mt-1 text-xs sm:text-sm text-amber-700">
                    You can continue, but if they save first, your update may be
                    rejected to prevent overwriting newer data.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="fullName"
              className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
            >
              Full Name
            </label>

            <input
              id="fullName"
              type="text"
              required
              value={state.formData.fullName}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  fullName: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              required
              value={state.formData.email}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  email: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder="e.g., john@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
            >
              Password {state.editingItem && '(leave empty to keep current)'}
            </label>

            <input
              id="password"
              type="password"
              required={!state.editingItem}
              value={state.formData.password}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  password: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder={
                state.editingItem
                  ? 'Leave empty to keep current'
                  : 'Enter password'
              }
            />
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
            >
              Phone Number
            </label>

            <input
              type="tel"
              id="phoneNumber"
              value={state.formData.phoneNumber}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  phoneNumber: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 text-sm sm:text-base"
              placeholder="e.g., +1234567890"
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-xs sm:text-sm font-medium text-slate-700 mb-1"
            >
              Role
            </label>

            <select
              id="role"
              required
              value={state.formData.role}
              onChange={(e) =>
                actions.setFormData({
                  ...state.formData,
                  role: e.target.value,
                })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-sm sm:text-base"
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={actions.closeModal}
              className="w-full sm:flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-700 text-white shadow-md border-0 rounded-xl font-semibold py-3 sm:py-2"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold py-3 sm:py-2"
            >
              {state.editingItem ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={state.showDeleteModal}
        onClose={actions.closeDeleteModal}
        title="Delete User"
      >
        <div className="space-y-6">
          <p className="text-slate-600 text-sm sm:text-base">
            Are you sure you want to delete user{' '}
            <strong>{state.deleteTarget?.fullName}</strong>? This action cannot
            be undone.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4">
            <Button
              onClick={actions.closeDeleteModal}
              className="w-full sm:flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-700 text-white shadow-md border-0 rounded-xl font-semibold py-3 sm:py-2"
            >
              Cancel
            </Button>

            <Button
              onClick={actions.handleDelete}
              className="w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-700 text-white shadow-lg border-0 rounded-xl font-semibold py-3 sm:py-2"
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

GuestModals.propTypes = {
  state: PropTypes.shape({
    showModal: PropTypes.bool.isRequired,
    showDeleteModal: PropTypes.bool.isRequired,
    editingItem: PropTypes.object,
    editingWarningEditors: PropTypes.arrayOf(
      PropTypes.shape({
        socketId: PropTypes.string,
        userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        userName: PropTypes.string,
        role: PropTypes.string,
      }),
    ),
    deleteTarget: PropTypes.shape({
      fullName: PropTypes.string,
    }),
    formData: PropTypes.shape({
      fullName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      password: PropTypes.string.isRequired,
      phoneNumber: PropTypes.string,
      role: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,

  actions: PropTypes.shape({
    closeModal: PropTypes.func.isRequired,
    closeDeleteModal: PropTypes.func.isRequired,
    setFormData: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
  }).isRequired,

  handleCustomSubmit: PropTypes.func.isRequired,
};