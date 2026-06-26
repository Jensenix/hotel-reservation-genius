import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export default function GuestModals({ state, actions, handleCustomSubmit }) {
  return (
    <>
      <Modal
        isOpen={state.showModal}
        onClose={actions.closeModal}
        title={state.editingItem ? 'Edit User' : 'Add New User'}
      >
        <form onSubmit={handleCustomSubmit} className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
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
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
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
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Password {state.editingItem && '(leave empty to keep current)'}
            </label>
            <input
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
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
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
            <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
              Role
            </label>
            <select
              required
              value={state.formData.role}
              onChange={(e) =>
                actions.setFormData({ ...state.formData, role: e.target.value })
              }
              className="w-full px-3 py-2.5 sm:px-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-white text-sm sm:text-base"
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          {/* Action Buttons - Stacked horizontally on sm+, vertically (Submit on top) on mobile */}
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
          {/* Action Buttons - Made Responsive */}
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