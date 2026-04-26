import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { ArrowLeft, Plus, Edit, Trash2, Bed, Layers, DollarSign, Users } from 'lucide-react';

const RoomTypeDetail = () => {
  const { roomTypeId } = useParams();
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Room Modal
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomTypeId: roomTypeId,
    floor: ''
  });

  // Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingRoom, setDeletingRoom] = useState(null);

  useEffect(() => {
    fetchRoomTypeDetail();
    fetchRooms();
  }, [roomTypeId]);

  const fetchRoomTypeDetail = async () => {
    try {
      const response = await apiService.roomTypes.getById(roomTypeId);
      setRoomType(response.data.data);
    } catch (error) {
      console.error('Error fetching room type:', error);
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await apiService.rooms.getAll();
      const allRooms = response.data.data || [];
      const typeRooms = allRooms.filter(room => room.roomTypeId === parseInt(roomTypeId));
      setRooms(typeRooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Room Handlers
  const handleOpenRoomModal = (room = null) => {
    if (room) {
      setEditingRoom(room);
      setRoomFormData({
        roomNumber: room.roomNumber,
        roomTypeId: room.roomTypeId,
        floor: room.floor
      });
    } else {
      setEditingRoom(null);
      setRoomFormData({
        roomNumber: '',
        roomTypeId: roomTypeId,
        floor: ''
      });
    }
    setShowRoomModal(true);
  };

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      roomTypeId: roomTypeId,
      floor: ''
    });
  };

  const handleSubmitRoom = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await apiService.rooms.update(editingRoom.id, roomFormData);
      } else {
        await apiService.rooms.create(roomFormData);
      }
      handleCloseRoomModal();
      fetchRooms();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Error saving room: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async () => {
    try {
      await apiService.rooms.delete(deletingRoom.id);
      setShowDeleteModal(false);
      setDeletingRoom(null);
      fetchRooms();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Error deleting room: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!roomType) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl border-b border-slate-700">
          <div className="container mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to="/admin/rooms">
                  <Button className="bg-slate-700 hover:bg-slate-600 text-white border-2 border-slate-600">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-4xl font-light tracking-tight mb-2">
                    {roomType.name}
                  </h1>
                  <p className="text-slate-300 text-sm tracking-wide uppercase">
                    Room Type Details & Physical Rooms
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleOpenRoomModal()}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg border border-emerald-400"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Physical Room
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Room Type Info Card */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-2 border-slate-700 shadow-xl mb-8">
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-amber-400">
                    <Layers className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Room Type</p>
                    <p className="text-2xl font-bold">{roomType.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-emerald-400">
                    <Bed className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-emerald-400 text-xs uppercase tracking-wider mb-1">Physical Rooms</p>
                    <p className="text-2xl font-bold">{rooms.length}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-blue-400">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-blue-400 text-xs uppercase tracking-wider mb-1">Base Price</p>
                    <p className="text-2xl font-bold">${roomType.basePrice}/night</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg border-2 border-purple-400">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-400 text-xs uppercase tracking-wider mb-1">Max Capacity</p>
                    <p className="text-2xl font-bold">{roomType.maxCapacity} guests</p>
                  </div>
                </div>
              </div>

              {roomType.description && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-slate-300">{roomType.description}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Physical Rooms Grid */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">Physical Rooms</h2>
            <p className="text-slate-600">{rooms.length} rooms found</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {rooms.map((room) => (
                <Card key={room.id} className="bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                          <Bed className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-xl">{room.roomNumber}</p>
                          <p className="text-slate-500 text-sm">Floor {room.floor}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleOpenRoomModal(room)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300 text-sm py-2"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => {
                          setDeletingRoom(room);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 text-sm py-2"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {rooms.length === 0 && !loading && (
            <div className="text-center py-16 bg-white border-2 border-dashed border-slate-300 rounded-xl">
              <Bed className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg mb-2">No physical rooms added yet</p>
              <p className="text-slate-400 text-sm mb-6">Click "Add Physical Room" to create the first room</p>
              <Button
                onClick={() => handleOpenRoomModal()}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg border border-emerald-400"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Room
              </Button>
            </div>
          )}
        </div>

        {/* Room Modal */}
        <Modal
          isOpen={showRoomModal}
          onClose={handleCloseRoomModal}
          title={editingRoom ? 'Edit Physical Room' : 'Add Physical Room'}
        >
          <form onSubmit={handleSubmitRoom} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Room Number</label>
              <input
                type="text"
                required
                value={roomFormData.roomNumber}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., A101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Floor</label>
              <input
                type="number"
                required
                min="1"
                value={roomFormData.floor}
                onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                placeholder="e.g., 1"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                onClick={handleCloseRoomModal}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg border border-amber-400"
              >
                {editingRoom ? 'Update Room' : 'Add Room'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingRoom(null);
          }}
          title="Delete Physical Room"
        >
          <div className="space-y-6">
            <p className="text-slate-600">
              Are you sure you want to delete room <strong>{deletingRoom?.roomNumber}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletingRoom(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg border border-red-400"
              >
                Delete Room
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default RoomTypeDetail;
