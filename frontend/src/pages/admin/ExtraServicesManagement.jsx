import React from 'react';
import {
  Coffee,
  Car,
  Utensils,
  Bell,
  Gift,
  Edit2,
  Trash2,
  Plus,
  Search,
} from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import Modal from '@/components/ui/Modal';
import { useAdminCRUD } from '@/hooks/admin/useAdminCRUD';

export default function ExtraServicesManagement() {
  const initialFormState = { name: '', description: '', price: '', icon: '' };

  const mapApiResponse = (apiData) => {
    return Array.isArray(apiData)
      ? apiData.map((item) => ({
          id: item.id,
          name: item.serviceName || item.name || '',
          description: item.description || '',
          price: parseFloat(item.price) || 0,
          icon: item.iconUrl || item.icon || 'default',
        }))
      : [];
  };

  const { state, actions } = useAdminCRUD({
    endpoint: 'extraServices',
    initialFormState,
    mapApiResponse,
  });

  const getIconComponent = (iconName) => {
    const icons = {
      room_service: Coffee,
      transfer: Car,
      spa: Utensils,
      laundry: Bell,
      breakfast: Coffee,
      tour: Gift,
    };
    const Icon = icons[iconName] || Coffee;
    return <Icon className="w-8 h-8 text-white" />;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-slate-800 mb-2">
              Extra Services{' '}
              <span className="font-semibold text-amber-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Manage Additional Amenities
            </p>
          </div>
          <button
            onClick={() => actions.setShowModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center transition-all"
          >
            <Plus className="w-5 h-5 mr-2" /> Add Service
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search services..."
            value={state.searchTerm}
            onChange={(e) => actions.setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Grid */}
        {state.loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.filteredData.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="bg-slate-900 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center shrink-0">
                      {getIconComponent(service.icon)}
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-semibold border border-emerald-500/30">
                      ${service.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {service.name}
                  </h3>
                  <p className="text-slate-400 text-sm line-clamp-2">
                    {service.description}
                  </p>
                </div>
                <div className="p-4 bg-white flex justify-end gap-2 border-t border-slate-100">
                  <button
                    onClick={() => actions.handleEdit(service, service)}
                    className="p-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      actions.setDeleteTarget(service);
                      actions.setShowDeleteModal(true);
                    }}
                    className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={state.showModal}
        onClose={actions.closeModal}
        title={state.editingItem ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={actions.handleSubmit} className="space-y-4">
          <input
            required
            type="text"
            placeholder="Service Name"
            value={state.formData.name}
            onChange={(e) =>
              actions.setFormData({ ...state.formData, name: e.target.value })
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <textarea
            placeholder="Description"
            value={state.formData.description}
            onChange={(e) =>
              actions.setFormData({
                ...state.formData,
                description: e.target.value,
              })
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 resize-none"
            rows={3}
          />
          <input
            required
            type="number"
            step="0.01"
            min="0"
            placeholder="Price ($)"
            value={state.formData.price}
            onChange={(e) =>
              actions.setFormData({ ...state.formData, price: e.target.value })
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <input
            type="text"
            placeholder="Icon Name (e.g. room_service, spa)"
            value={state.formData.icon}
            onChange={(e) =>
              actions.setFormData({ ...state.formData, icon: e.target.value })
            }
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500"
          />
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={actions.closeModal}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600"
            >
              {state.editingItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={state.showDeleteModal}
        onClose={actions.closeDeleteModal}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <p>
            Are you sure you want to delete{' '}
            <strong>{state.deleteTarget?.name}</strong>?
          </p>
          <div className="flex gap-3">
            <button
              onClick={actions.closeDeleteModal}
              className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleDelete}
              className="flex-1 bg-red-500 text-white py-3 rounded-lg font-medium"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
