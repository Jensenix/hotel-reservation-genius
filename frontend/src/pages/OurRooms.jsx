import { useOurRooms } from '@/hooks/public/useOurRooms';
import OurRoomsHero from '@/components/rooms/OurRoomsHero';
import RoomFilters from '@/components/rooms/RoomFilters';
import RoomList from '@/components/rooms/RoomList';
import RoomSkeleton from '@/components/rooms/RoomSkeleton';

const OurRooms = () => {
  const { loading, filters, updateFilters, clearFilters, filteredRooms } =
    useOurRooms();

  if (loading) {
    return <RoomSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <OurRoomsHero />
      <RoomFilters
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
      />
      <RoomList rooms={filteredRooms} clearFilters={clearFilters} />
    </div>
  );
};

export default OurRooms;
