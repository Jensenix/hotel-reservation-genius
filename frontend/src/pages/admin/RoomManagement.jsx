import AdminLayout from '@/layouts/AdminLayout';
import Button from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { useRoomTypes } from '@/hooks/public/useRoomTypes';
import RoomTypeStats from '@/components/admin/rooms/RoomTypeStats';
import RoomTypeGrid from '@/components/admin/rooms/RoomTypeGrid';
import RoomTypeModals from '@/components/admin/rooms/RoomTypeModals';

const RoomManagement = () => {
  const roomState = useRoomTypes();

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
                  <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
                    Room Management
                  </span>
                  <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
                </div>
                <h1 className="text-5xl font-light text-slate-800 mb-2 tracking-tight">
                  Hotel{' '}
                  <span className="font-semibold text-amber-600">
                    Room Types
                  </span>
                </h1>
                <p className="text-slate-500 text-sm tracking-wide">
                  Manage Accommodation Categories & Pricing
                </p>
              </div>
              <Button
                onClick={() => roomState.handleOpenRoomTypeModal()}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl border-0 px-8 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Room Type
              </Button>
            </div>
          </div>

          <RoomTypeStats roomTypes={roomState.roomTypes} />

          <RoomTypeGrid {...roomState} />
        </div>

        <RoomTypeModals {...roomState} />
      </div>
    </AdminLayout>
  );
};

export default RoomManagement;
