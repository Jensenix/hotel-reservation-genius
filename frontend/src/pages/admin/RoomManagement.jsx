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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-light tracking-tight mb-2">
                  Room <span className="font-semibold text-amber-400">Types</span>
                </h1>
                <p className="text-slate-300 text-sm tracking-wide uppercase">
                  Manage Hotel Room Types
                </p>
              </div>
              <Button
                onClick={() => handleOpenRoomTypeModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Room Type
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-2 border-slate-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Room Types</p>
                  <p className="text-3xl font-bold">{roomTypes.length}</p>
                </div>
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-emerald-900 to-emerald-800 text-white border-2 border-emerald-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-300 text-xs uppercase tracking-wider mb-1">Total Physical Rooms</p>
                  <p className="text-3xl font-bold">{roomTypes.reduce((sum, rt) => sum + (rt.rooms?.length || 0), 0)}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900 to-blue-800 text-white border-2 border-blue-700 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-xs uppercase tracking-wider mb-1">Avg. Base Price</p>
                  <p className="text-3xl font-bold">
                    ${roomTypes.length > 0 
                      ? Math.round(roomTypes.reduce((sum, rt) => sum + parseFloat(rt.basePrice || 0), 0) / roomTypes.length)
                      : 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Search Section */}
          <Card className="bg-white border-2 border-slate-200 shadow-xl mb-8">
            <div className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search room types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </Card>

          {/* Room Types Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRoomTypes.map((roomType) => (
                <Card key={roomType.id} className="bg-white border-2 border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-400">
                        <Layers className="w-7 h-7 text-white" />
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 text-xs uppercase tracking-wider">Rooms</p>
                        <p className="text-white text-2xl font-bold">{getRoomCount(roomType)}</p>
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{roomType.name}</h3>
                    <p className="text-slate-400 text-sm mb-4">{roomType.description || 'No description'}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-amber-400 text-xs uppercase tracking-wider">Price</p>
                        <p className="text-white font-semibold">${roomType.basePrice}/night</p>
                      </div>
                      <div>
                        <p className="text-blue-400 text-xs uppercase tracking-wider">Capacity</p>
                        <p className="text-white font-semibold">{roomType.maxCapacity} guests</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/rooms/${roomType.id}`}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white border-2 border-emerald-500 rounded-lg px-4 py-3 text-center font-medium transition-all"
                      >
                        <ChevronRight className="w-4 h-4 inline mr-2" />
                        View Rooms
                      </Link>
                      <Button
                        onClick={() => handleOpenRoomTypeModal(roomType)}
                        className="bg-amber-600 hover:bg-amber-700 text-white border-2 border-amber-500"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => {
                          setDeleteTarget({ id: roomType.id, name: roomType.name });
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white border-2 border-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredRoomTypes.length === 0 && !loading && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12">
                  <Layers className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 text-lg">No room types found</p>
                  <Button
                    onClick={() => handleOpenRoomTypeModal()}
                    className="mt-4 bg-amber-500 hover:bg-amber-600 text-white border-2 border-amber-400"
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
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400"
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
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border border-red-400"
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
