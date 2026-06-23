import React from 'react';
import { Building2, Star, CheckCircle2, Edit2, Trash2, Plus, Search } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';
import { useAdminCRUD } from '@/hooks/useAdminCRUD';

export default function FacilitiesManagement() {
  const initialFormState = { facilityName: '', iconUrl: '' };

  const mapApiResponse = (apiData) => {
    return Array.isArray(apiData) ? apiData.map((item) => ({
      id: item.id,
      name: item.facilityName || item.name || 'Unknown Facility',
      icon: item.iconUrl || item.icon || 'default',
    })) : [];
  };

  const { state, actions } = useAdminCRUD({
    endpoint: 'facilities',
    initialFormState,
    mapApiResponse
  });

  const getIconComponent = (iconName) => {
    const icons = { pool: Building2, fitness: Star, spa: CheckCircle2, restaurant: Star, business: Star };
    const Icon = icons[iconName] || Building2;
    return <Icon size={24} />;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Search */}
        <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                Facilities <span className="font-semibold text-amber-600">Management</span>
              </h1>
              <p className="text-slate-500 text-sm">Manage Hotel Amenities & Services</p>
            </div>
            <button
              onClick={() => actions.setShowModal(true)}
              className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl px-8 py-3 rounded-xl font-semibold transition-all"
            >
              <Plus className="w-5 h-5 mr-2 inline" /> Add Facility
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search facilities..."
              value={state.searchTerm}
              onChange={(e) => actions.setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-xl p-8">
            <div className="text-amber-400 mb-4"><Building2 size={32} /></div>
            <p className="text-4xl font-light mb-2">{state.data.length}</p>
            <p className="text-slate-400 text-sm">Total Facilities</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl shadow-xl p-8">
            <div className="text-emerald-300 mb-4"><CheckCircle2 size={32} /></div>
            <p className="text-4xl font-light mb-2">{state.data.length}</p>
            <p className="text-emerald-100 text-sm">Currently Active</p>
          </div>
          <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-2xl shadow-xl p-8">
            <div className="text-amber-300 mb-4"><Star size={32} /></div>
            <p className="text-4xl font-light mb-2">{state.filteredData.length}</p>
            <p className="text-amber-100 text-sm">Search Results</p>
          </div>
        </div>

        {/* Data Grid */}
        {state.loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {state.filteredData.map((facility) => (
              <div key={facility.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-xl border-2 border-amber-400 mb-6 text-white">
                    {getIconComponent(facility.icon)}
                  </div>
                  <h3 className="text-2xl font-light text-white mb-2">{facility.name}</h3>
                </div>
                <div className="p-6 bg-white flex space-x-2">
                  <button onClick={() => actions.handleEdit(facility, { facilityName: facility.name, iconUrl: facility.icon })} className="p-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => { actions.setDeleteTarget(facility); actions.setShowDeleteModal(true); }} className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={state.showModal} onClose={actions.closeModal} title={state.editingItem ? 'Edit Facility' : 'Add Facility'}>
        <form onSubmit={actions.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Facility Name</label>
            <input
              type="text" required
              value={state.formData.facilityName}
              onChange={(e) => actions.setFormData({ ...state.formData, facilityName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Icon URL</label>
            <input
              type="text"
              value={state.formData.iconUrl}
              onChange={(e) => actions.setFormData({ ...state.formData, iconUrl: e.target.value })}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={actions.closeModal} className="flex-1 bg-slate-500 text-white py-3 rounded-xl font-semibold">Cancel</button>
            <button type="submit" className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-semibold">{state.editingItem ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={state.showDeleteModal} onClose={actions.closeDeleteModal} title="Confirm Delete">
        <div className="space-y-6">
          <p>Are you sure you want to delete <strong>{state.deleteTarget?.name}</strong>?</p>
          <div className="flex gap-4">
            <button onClick={actions.closeDeleteModal} className="flex-1 bg-slate-500 text-white py-3 rounded-xl">Cancel</button>
            <button onClick={actions.handleDelete} className="flex-1 bg-red-500 text-white py-3 rounded-xl">Delete</button>
          </div>
        </div>
      </Modal>

    </AdminLayout>
  );
}