import Loading from '@/components/ui/Loading';
import AdminLayout from '@/layouts/AdminLayout';
import { useRoomAvailability } from '@/hooks/admin/useRoomAvailability';
import AvailabilityHeader from '@/components/admin/rooms/roomAvailability/AvailabilityHeader';
import AvailabilityStats from '@/components/admin/rooms/roomAvailability/AvailabilityStats';
import RoomTypeAccordion from '@/components/admin/rooms/roomAvailability/RoomTypeAccordion';

const RoomAvailability = () => {
  const {
    availabilityData,
    loading,
    selectedDate,
    setSelectedDate,
    expandedRoomType,
    toggleRoomTypeDetails,
    setToday,
  } = useRoomAvailability();

  if (loading || !availabilityData) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <Loading size="large" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AvailabilityHeader
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setToday={setToday}
          />

          <AvailabilityStats overall={availabilityData.overall} />

          <RoomTypeAccordion
            roomTypes={availabilityData.byRoomType}
            expandedRoomType={expandedRoomType}
            onToggle={toggleRoomTypeDetails}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default RoomAvailability;
