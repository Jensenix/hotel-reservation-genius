import React, { useState, useEffect } from 'react';
import {
  Plus,
  Coffee,
  Car,
  Utensils,
  Bell,
  Gift,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import apiService from '@/services/apiService';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

const ExtraServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Service Modal
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    description: '',
    price: '',
    icon: '',
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await apiService.extraServices.getAll();
      console.log('API Response:', response);
      const apiData = response.data?.data || response.data || [];
      console.log('Raw API Data:', apiData);

      // Map API response to frontend format
      const mappedData = Array.isArray(apiData)
        ? apiData.map((item) => ({
            id: item.id,
            name: item.serviceName || item.name || 'Unknown Service',
            description: item.description || '',
            price: parseFloat(item.price) || 0,
            icon: item.iconUrl || item.icon || 'default',
          }))
        : [];

      console.log('Mapped Services Data:', mappedData);
      setServices(mappedData);
    } catch (error) {
      console.error('Error fetching extra services:', error);
      // Mock data for development - always load this for now
      const mockServices = [
        {
          id: 1,
          name: 'Room Service',
          description: '24/7 in-room dining service',
          price: 5.0,
          icon: 'room_service',
        },
        {
          id: 2,
          name: 'Airport Transfer',
          description: 'Private airport pickup and drop-off',
          price: 25.0,
          icon: 'transfer',
        },
        {
          id: 3,
          name: 'Spa Package',
          description: 'Full body massage and wellness treatment',
          price: 120.0,
          icon: 'spa',
        },
        {
          id: 4,
          name: 'Laundry Service',
          description: 'Professional laundry and dry cleaning',
          price: 15.0,
          icon: 'laundry',
        },
        {
          id: 5,
          name: 'Breakfast Buffet',
          description: 'International breakfast buffet',
          price: 18.0,
          icon: 'breakfast',
        },
        {
          id: 6,
          name: 'City Tour',
          description: 'Guided city tour with transportation',
          price: 45.0,
          icon: 'tour',
        },
      ];
      console.log('Using mock services:', mockServices);
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenServiceModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceFormData({
        name: service.name,
        description: service.description || '',
        price: service.price || '',
        icon: service.icon || '',
      });
    } else {
      setEditingService(null);
      setServiceFormData({
        name: '',
        description: '',
        price: '',
        icon: '',
      });
    }
    setShowServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setShowServiceModal(false);
    setEditingService(null);
    setServiceFormData({
      name: '',
      description: '',
      price: '',
      icon: '',
    });
  };

  const handleDeleteClick = (service) => {
    setDeleteTarget(service);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await apiService.extraServices.update(
          editingService.id,
          serviceFormData,
        );
      } else {
        await apiService.extraServices.create(serviceFormData);
      }
      handleCloseServiceModal();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(
        'Error saving service: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.extraServices.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert(
        'Error deleting service: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const filteredServices = Array.isArray(services)
    ? services.filter(
        (service) =>
          service &&
          service.name &&
          service.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const getIconComponent = (icon) => {
    const icons = {
      room_service: Coffee,
      transfer: Car,
      spa: Utensils,
      laundry: Bell,
      breakfast: Coffee,
      tour: Gift,
    };
    const Icon = icons[icon] || Coffee;
    return <Icon className="w-8 h-8 text-white" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-6 py-8">
          {/* Page Header - Luxury Style */}
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                    Extra Services
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Hotel{' '}
                  <span className="font-semibold text-amber-600">Services</span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">
                  Manage Additional Services & Amenities
                </p>
              </div>
              <button
                onClick={() => handleOpenServiceModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Service
              </button>
            </div>
          </div>

          {/* Stats Cards - Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-amber-500/20 rounded-2xl">
                    <Coffee className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Total Services
                </p>
                <p className="text-4xl font-light">{services.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <Utensils className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-emerald-300 text-xs uppercase tracking-wider mb-2">
                  Active Services
                </p>
                <p className="text-4xl font-light">{services.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-2xl">
                    <Gift className="w-8 h-8 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Premium
                  </span>
                </div>
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">
                  Premium Services
                </p>
                <p className="text-4xl font-light">
                  {Math.ceil(services.length * 0.4)}
                </p>
              </div>
            </div>
          </div>

          {/* Search Section - Elegant */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Services Grid - Luxury */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                          {getIconComponent(service.icon)}
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                            Price
                          </p>
                          <p className="text-white text-2xl font-light">
                            {formatCurrency(service.price)}
                          </p>
                        </div>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {service.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenServiceModal(service)}
                        className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Edit Service"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Delete Service"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredServices.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                  <Coffee className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-lg mb-4">
                    No services found
                  </p>
                  <button
                    onClick={() => handleOpenServiceModal()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Service
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Service Modal */}
        <Modal
          isOpen={showServiceModal}
          onClose={handleCloseServiceModal}
          title={editingService ? 'Edit Service' : 'Add New Service'}
        >
          <form onSubmit={handleSubmitService} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Service Name
              </label>
              <input
                type="text"
                required
                value={serviceFormData.name}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., Room Service"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Description
              </label>
              <textarea
                value={serviceFormData.description}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="Describe the service..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Price ($)
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={serviceFormData.price}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    price: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., 25.00"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Icon (optional)
              </label>
              <input
                type="text"
                value={serviceFormData.icon}
                onChange={(e) =>
                  setServiceFormData({
                    ...serviceFormData,
                    icon: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., room_service, transfer, spa"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCloseServiceModal}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeleteTarget(null);
          }}
          title="Delete Service"
        >
          <div className="space-y-6">
            <p className="text-slate-600">
              Are you sure you want to delete{' '}
              <strong>{deleteTarget?.name}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Delete Service
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default ExtraServicesManagement;
