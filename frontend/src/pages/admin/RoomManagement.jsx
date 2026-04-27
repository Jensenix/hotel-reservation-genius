import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2, Search, Building2, DollarSign, Layers, ChevronRight } from 'lucide-react';

const RoomManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Room Type Modal
  const [showRoomTypeModal, setShowRoomTypeModal] = useState(false);
  const [editingRoomType, setEditingRoomType] = useState(null);
  const [roomTypeFormData, setRoomTypeFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    maxCapacity: ''
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { id: number, name: string }

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await apiService.roomTypes.getAll();
      setRoomTypes(response.data.data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  // Room Type Handlers
  const handleOpenRoomTypeModal = (roomType = null) => {
    if (roomType) {
      setEditingRoomType(roomType);
      setRoomTypeFormData({
        name: roomType.name,
        description: roomType.description || '',
        basePrice: roomType.basePrice,
        maxCapacity: roomType.maxCapacity
      });
    } else {
      setEditingRoomType(null);
      setRoomTypeFormData({
        name: '',
        description: '',
        basePrice: '',
        maxCapacity: ''
      });
    }
    setShowRoomTypeModal(true);
  };

  const handleCloseRoomTypeModal = () => {
    setShowRoomTypeModal(false);
    setEditingRoomType(null);
    setRoomTypeFormData({
      name: '',
      description: '',
      basePrice: '',
      maxCapacity: ''
    });
  };

  const handleSubmitRoomType = async (e) => {
    e.preventDefault();
    try {
      if (editingRoomType) {
        await apiService.roomTypes.update(editingRoomType.id, roomTypeFormData);
      } else {
        await apiService.roomTypes.create(roomTypeFormData);
      }
      handleCloseRoomTypeModal();
      fetchRoomTypes();
    } catch (error) {
      console.error('Error saving room type:', error);
      alert('Error saving room type: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete Handler
  const handleDelete = async () => {
    try {
      await apiService.roomTypes.delete(deleteTarget.id);
      setShowDeleteModal(false);
      setDeleteTarget(null);
      fetchRoomTypes();
    } catch (error) {
      console.error('Error deleting room type:', error);
      alert('Error deleting room type: ' + (error.response?.data?.message || error.message));
    }
  };

  const getRoomCount = (roomType) => {
    return roomType.rooms ? roomType.rooms.length : 0;
  };

  const filteredRoomTypes = roomTypes.filter(roomType =>
    roomType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">Room Management</span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Hotel <span className="font-semibold text-amber-600">Room Types</span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">Manage Accommodation Categories & Pricing</p>
              </div>
              <Button
                onClick={() => handleOpenRoomTypeModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Room Type
              </Button>
            </div>
          </div>

          {/* Stats Cards - Luxury Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl shadow-2xl border border-slate-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-amber-500/20 rounded-2xl">
                    <Layers className="w-8 h-8 text-amber-400" />
                  </div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Types</span>
                </div>
                <p className="text-slate-400 text-xs uppercase tracking-wider mb-2">Room Types</p>
                <p className="text-4xl font-light">{roomTypes.length}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white rounded-2xl shadow-2xl border border-emerald-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-emerald-500/20 rounded-2xl">
                    <Building2 className="w-8 h-8 text-emerald-400" />
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Rooms</span>
                </div>
                <p className="text-emerald-300 text-xs uppercase tracking-wider mb-2">Physical Rooms</p>
                <p className="text-4xl font-light">{roomTypes.reduce((sum, rt) => sum + (rt.rooms?.length || 0), 0)}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-2xl shadow-2xl border border-blue-700 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-10 rounded-full -mr-16 -mt-16"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-4 bg-blue-500/20 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-blue-400" />
                  </div>
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Price</span>
                </div>
                <p className="text-blue-300 text-xs uppercase tracking-wider mb-2">Avg. Base Price</p>
                <p className="text-4xl font-light">
                  ${roomTypes.length > 0
                    ? Math.round(roomTypes.reduce((sum, rt) => sum + parseFloat(rt.basePrice || 0), 0) / roomTypes.length)
                    : 0}
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
                placeholder="Search room types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-slate-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Room Types Grid - Luxury */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRoomTypes.map((roomType) => (
                <div key={roomType.id} className="bg-white rounded-2xl shadow-xl border border-slate-200 hover:shadow-2xl transition-all duration-500 overflow-hidden group">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity duration-500"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-amber-400">
                          <Layers className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Rooms</p>
                          <p className="text-white text-3xl font-light">{getRoomCount(roomType)}</p>
                        </div>
                      </div>
                      <h3 className="text-2xl font-light text-white mb-3 tracking-tight">{roomType.name}</h3>
                      <p className="text-slate-400 text-sm mb-6 leading-relaxed">{roomType.description || 'No description'}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">Price</p>
                          <p className="text-white font-semibold text-lg">${roomType.basePrice}/night</p>
                        </div>
                        <div>
                          <p className="text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">Capacity</p>
                          <p className="text-white font-semibold text-lg">{roomType.maxCapacity} guests</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-white">
                    <div className="flex gap-3">
                      <Link
                        to={`/admin/rooms/${roomType.id}`}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 rounded-xl px-4 py-3 text-center font-medium shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <ChevronRight className="w-4 h-4 inline mr-2" />
                        View Rooms
                      </Link>
                      <Button
                        onClick={() => handleOpenRoomTypeModal(roomType)}
                        className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white border-0 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteTarget({ id: roomType.id, name: roomType.name });
                          setShowDeleteModal(true);
                        }}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredRoomTypes.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
                  <Layers className="w-20 h-20 text-slate-300 mx-auto mb-6" />
                  <p className="text-slate-500 text-lg mb-4">No room types found</p>
                  <Button
                    onClick={() => handleOpenRoomTypeModal()}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 px-8 py-3 rounded-xl font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Room Type
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Room Type Modal */}
        <Modal
          isOpen={showRoomTypeModal}
          onClose={handleCloseRoomTypeModal}
          title={editingRoomType ? 'Edit Room Type' : 'Add New Room Type'}
        >
          <form onSubmit={handleSubmitRoomType} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Room Type Name</label>
              <input
                type="text"
                required
                value={roomTypeFormData.name}
                onChange={(e) => setRoomTypeFormData({ ...roomTypeFormData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., Standard Room"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={roomTypeFormData.description}
                onChange={(e) => setRoomTypeFormData({ ...roomTypeFormData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="Describe the room type..."
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Base Price ($)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={roomTypeFormData.basePrice}
                onChange={(e) => setRoomTypeFormData({ ...roomTypeFormData, basePrice: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., 100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Capacity (Guests)</label>
              <input
                type="number"
                required
                min="1"
                value={roomTypeFormData.maxCapacity}
                onChange={(e) => setRoomTypeFormData({ ...roomTypeFormData, maxCapacity: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., 2"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={handleCloseRoomTypeModal}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                {editingRoomType ? 'Update Room Type' : 'Create Room Type'}
              </Button>
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
          title="Delete Room Type"
        >
          <div className="space-y-6">
            <p className="text-slate-600">
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This will also delete all physical rooms associated with this type. This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteTarget(null);
                }}
                className="flex-1 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-md border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border-0 rounded-xl font-semibold transition-all duration-300"
              >
                Delete Room Type
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default RoomManagement;
