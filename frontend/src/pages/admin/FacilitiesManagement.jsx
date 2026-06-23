import React, { useState, useEffect } from 'react';
import {
  Plus,
  Building2,
  Star,
  CheckCircle2,
  Edit2,
  Trash2,
  Search,
} from 'lucide-react';
import apiService from '@/services/apiService';
import AdminLayout from '@/components/layout/AdminLayout';
import Modal from '@/components/common/Modal';

const FacilitiesManagement = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Facility Modal
  const [showFacilityModal, setShowFacilityModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState(null);
  const [facilityFormData, setFacilityFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const response = await apiService.facilities.getAll();
      console.log('API Response:', response);
      const apiData = response.data?.data || response.data || [];
      console.log('Raw API Data:', apiData);

      // Map API response to frontend format
      const mappedData = Array.isArray(apiData)
        ? apiData.map((item) => ({
            id: item.id,
            name: item.facilityName || item.name || 'Unknown Facility',
            description: item.description || '',
            icon: item.iconUrl || item.icon || 'default',
          }))
        : [];

      console.log('Mapped Facilities Data:', mappedData);
      setFacilities(mappedData);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      // Mock data for development - always load this for now
      const mockFacilities = [
        {
          id: 1,
          name: 'Swimming Pool',
          description: 'Outdoor infinity pool with city view',
          icon: 'pool',
        },
        {
          id: 2,
          name: 'Fitness Center',
          description: '24/7 gym with modern equipment',
          icon: 'fitness',
        },
        {
          id: 3,
          name: 'Spa & Wellness',
          description: 'Full-service spa and massage therapy',
          icon: 'spa',
        },
        {
          id: 4,
          name: 'Restaurant',
          description: 'Fine dining restaurant with international cuisine',
          icon: 'restaurant',
        },
        {
          id: 5,
          name: 'Business Center',
          description: 'Meeting rooms and business services',
          icon: 'business',
        },
      ];
      console.log('Using mock facilities:', mockFacilities);
      setFacilities(mockFacilities);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFacilityModal = (facility = null) => {
    if (facility) {
      setEditingFacility(facility);
      setFacilityFormData({
        name: facility.name,
        description: facility.description || '',
        icon: facility.icon || '',
      });
    } else {
      setEditingFacility(null);
      setFacilityFormData({
        name: '',
        description: '',
        icon: '',
      });
    }
    setShowFacilityModal(true);
  };

  const handleCloseFacilityModal = () => {
    setShowFacilityModal(false);
    setEditingFacility(null);
    setFacilityFormData({
      name: '',
      description: '',
      icon: '',
    });
  };

  const handleDeleteClick = (facility) => {
    setDeleteTarget(facility);
  };

  const handleSubmitFacility = async (e) => {
    e.preventDefault();
    try {
      if (editingFacility) {
        await apiService.facilities.update(
          editingFacility.id,
          facilityFormData,
        );
      } else {
        await apiService.facilities.create(facilityFormData);
      }
      handleCloseFacilityModal();
      fetchFacilities();
    } catch (error) {
      console.error('Error saving facility:', error);
      alert(
        'Error saving facility: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.facilities.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      alert(
        'Error deleting facility: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const filteredFacilities = Array.isArray(facilities)
    ? facilities.filter(
        (facility) =>
          facility &&
          facility.name &&
          facility.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const getIconComponent = (icon) => {
    const icons = {
      pool: Building2,
      fitness: Star,
      spa: CheckCircle2,
      restaurant: Star,
      business: Star,
    };
    const Icon = icons[icon] || Star;
    return <Icon className="w-8 h-8 text-white" />;
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
                    Facilities Management
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Hotel{' '}
                  <span className="font-semibold text-amber-600">
                    Facilities
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">
                  Manage Hotel Amenities & Services
                </p>
              </div>
              <button
                onClick={() => handleOpenFacilityModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Facility
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
                    <Building2 className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Total
                  </span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">
                  Total Facilities
                </p>
                <p className="text-4xl font-light">{facilities.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                    Active
                  </span>
                </div>
                <p className="text-emerald-300 text-xs uppercase tracking-wider mb-2">
                  Active Facilities
                </p>
                <p className="text-4xl font-light">{facilities.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-2xl">
                    <Star className="w-8 h-8 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Premium
                  </span>
                </div>
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">
                  Premium Services
                </p>
                <p className="text-4xl font-light">
                  {Math.ceil(facilities.length * 0.6)}
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
                placeholder="Search facilities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Facilities Grid - Luxury */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
                >
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                          {getIconComponent(facility.icon)}
                        </div>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-3 tracking-tight">
                        {facility.name}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {facility.description || 'No description'}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleOpenFacilityModal(facility)}
                        className="p-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Edit Facility"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(facility)}
                        className="p-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        title="Delete Facility"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredFacilities.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                  <Building2 className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-lg mb-4">
                    No facilities found
                  </p>
                  <button
                    onClick={() => handleOpenFacilityModal()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Facility
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Facility Modal */}
        <Modal
          isOpen={showFacilityModal}
          onClose={handleCloseFacilityModal}
          title={editingFacility ? 'Edit Facility' : 'Add New Facility'}
        >
          <form onSubmit={handleSubmitFacility} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Facility Name
              </label>
              <input
                type="text"
                required
                value={facilityFormData.name}
                onChange={(e) =>
                  setFacilityFormData({
                    ...facilityFormData,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., Swimming Pool"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Description
              </label>
              <textarea
                value={facilityFormData.description}
                onChange={(e) =>
                  setFacilityFormData({
                    ...facilityFormData,
                    description: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="Describe the facility..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                Icon (optional)
              </label>
              <input
                type="text"
                value={facilityFormData.icon}
                onChange={(e) =>
                  setFacilityFormData({
                    ...facilityFormData,
                    icon: e.target.value,
                  })
                }
                className="w-full px-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
                placeholder="e.g., pool, fitness, spa"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={handleCloseFacilityModal}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                {editingFacility ? 'Update Facility' : 'Add Facility'}
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
          title="Delete Facility"
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
                Delete Facility
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default FacilitiesManagement;
