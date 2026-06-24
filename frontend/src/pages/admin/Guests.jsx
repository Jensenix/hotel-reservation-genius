import { useState } from 'react';
import { Plus } from 'lucide-react';
import apiService from '@/services/apiService';
import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/components/ui/Button';
import { useAdminCRUD } from '@/hooks/admin/useAdminCRUD';

// UI Components
import GuestStats from '@/components/admin/guests/GuestStats';
import GuestFilterBar from '@/components/admin/guests/GuestFilterBar';
import GuestTable from '@/components/admin/guests/GuestTable';
import GuestModals from '@/components/admin/guests/GuestModals';

export default function Guests() {
  const [roleFilter, setRoleFilter] = useState('');
  const initialFormState = {
    fullName: '',
    email: '',
    password: '',
    phoneNumber: '',
    role: 'guest',
  };

  const mapApiResponse = (apiData) => {
    return Array.isArray(apiData)
      ? apiData.map((item) => ({
          id: item.id,
          name: item.fullName || '',
          fullName: item.fullName || '',
          email: item.email || '',
          phoneNumber: item.phoneNumber || '',
          role: item.role || 'guest',
        }))
      : [];
  };

  const { state, actions } = useAdminCRUD({
    endpoint: 'users',
    initialFormState,
    mapApiResponse,
  });

  const finalFilteredUsers = state.filteredData.filter(
    (user) => !roleFilter || user.role === roleFilter,
  );

  const handleCustomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state.editingItem) {
        const updateData = { ...state.formData };
        if (!updateData.password) delete updateData.password;
        await apiService.users.update(state.editingItem.id, updateData);
      } else {
        await apiService.users.create(state.formData);
      }
      actions.closeModal();
      actions.fetchData();
    } catch (error) {
      alert(
        'Error saving user: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                    User Management
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Hotel{' '}
                  <span className="font-semibold text-amber-600">
                    Users & Staff
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">
                  Manage Hotel Personnel & Guest Accounts
                </p>
              </div>
              <Button
                onClick={() => actions.setShowModal(true)}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" /> Add User
              </Button>
            </div>
          </div>

          <GuestStats users={state.data} />

          <GuestFilterBar
            searchTerm={state.searchTerm}
            setSearchTerm={actions.setSearchTerm}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
          />

          <GuestTable
            users={finalFilteredUsers}
            loading={state.loading}
            allUsers={state.data}
            onEdit={actions.handleEdit}
            onDelete={(user) => {
              actions.setDeleteTarget(user);
              actions.setShowDeleteModal(true);
            }}
            onAddUser={() => actions.setShowModal(true)}
          />

          <GuestModals
            state={state}
            actions={actions}
            handleCustomSubmit={handleCustomSubmit}
          />
        </div>
      </div>
    </AdminLayout>
  );
}
