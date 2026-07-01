import AdminLayout from '@/layouts/AdminLayout';
import { useRoomTypeDetail } from '@/hooks/admin/useRoomTypeDetail';
import RoomTypeHeader from '@/components/admin/rooms/roomTypeDetail/RoomTypeHeader';
import PhysicalRoomsGrid from '@/components/admin/rooms/roomTypeDetail/PhysicalRoomsGrid';
import RoomModals from '@/components/admin/rooms/roomTypeDetail/RoomModals';

const RoomTypeDetail = () => {
  const {
    roomType,
    rooms,
    setRooms, 
    loading,
    showRoomModal,
    editingRoom,
    roomFormData,
    setRoomFormData,
    showDeleteModal,
    setShowDeleteModal,
    deletingRoom,
    setDeletingRoom,
    handleOpenRoomModal,
    handleCloseRoomModal,
    handleSubmitRoom,
    handleDelete,
  } = useRoomTypeDetail();

  const handleUpdateLocalState = (roomId, newStatus) => {
    if (setRooms) {
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === roomId ? { ...room, status: newStatus } : room
        )
      );
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <RoomTypeHeader
            roomType={roomType}
            roomsCount={rooms.length}
            onAddRoom={handleOpenRoomModal}
          />
          <PhysicalRoomsGrid
            rooms={rooms}
            loading={loading}
            onEdit={handleOpenRoomModal}
            onDelete={(room) => {
              setDeletingRoom(room);
              setShowDeleteModal(true);
            }}
            onAddFirstRoom={() => handleOpenRoomModal()}
            onUpdateLocalState={handleUpdateLocalState}
          />
        </div>

        <RoomModals
          showRoomModal={showRoomModal}
          handleCloseRoomModal={handleCloseRoomModal}
          editingRoom={editingRoom}
          handleSubmitRoom={handleSubmitRoom}
          roomFormData={roomFormData}
          setRoomFormData={setRoomFormData}
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          deletingRoom={deletingRoom}
          setDeletingRoom={setDeletingRoom}
          handleDelete={handleDelete}
        />
      </div>
    </AdminLayout>
  );
};

export default RoomTypeDetail;