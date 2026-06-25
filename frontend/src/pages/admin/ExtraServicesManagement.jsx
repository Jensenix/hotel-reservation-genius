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
import { useAdminCRUD } from '@/hooks/admin/useAdminCRUD';
import ExtraServiceFormModal from '@/components/admin/extraServices/ExtraServiceFormModal';
import DeleteConfirmModal from '@/components/admin/common/DeleteConfirmModal';

const initialFormState = { serviceName: '', description: '', price: '', iconUrl: '' };

const mapApiResponse = (apiData) => {
  return Array.isArray(apiData)
    ? apiData.map((item) => ({
        id: item.id,
        serviceName: item.serviceName || item.name || '',
        description: item.description || '',
        price: parseFloat(item.price) || 0,
        iconUrl: item.iconUrl || item.icon || 'default',
      }))
    : [];
};

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

export default function ExtraServicesManagement() {
  const { state, actions } = useAdminCRUD({
    endpoint: 'extraServices',
    initialFormState,
    mapApiResponse,
  });

  const handleFormChange = (field, value) => {
    actions.setFormData((prev) => ({ ...prev, [field]: value }));
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
                      {getIconComponent(service.iconUrl)}
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg font-semibold border border-emerald-500/30">
                      ${service.price}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-white mb-1">
                    {service.serviceName}
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

      <ExtraServiceFormModal
        isOpen={state.showModal}
        onClose={actions.closeModal}
        onSubmit={actions.handleSubmit}
        formData={state.formData}
        onChange={handleFormChange}
        isEditing={!!state.editingItem}
      />

      <DeleteConfirmModal
        isOpen={state.showDeleteModal}
        onClose={actions.closeDeleteModal}
        onConfirm={actions.handleDelete}
        itemName={state.deleteTarget?.serviceName}
      />
    </AdminLayout>
  );
}