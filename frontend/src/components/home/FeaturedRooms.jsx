import { Link } from 'react-router-dom';
import {
  Home as HomeIcon,
  Users,
  Wifi,
  Coffee,
  ChevronRight,
} from 'lucide-react';
import { useFeaturedRooms } from '@/hooks/public/useFeaturedRoom';

const RoomSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse"></div>
    <div className="p-8">
      <div className="h-4 bg-slate-200 rounded mb-4 animate-pulse"></div>
      <div className="h-3 bg-slate-200 rounded mb-2 animate-pulse"></div>
      <div className="h-3 bg-slate-200 rounded w-3/4 animate-pulse"></div>
    </div>
  </div>
);

const FeaturedRooms = () => {
  const { rooms, loading, error } = useFeaturedRooms(3);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-xs font-semibold tracking-widest uppercase">
              Luxury Stays
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
          <h2 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
            Exquisite{' '}
            <span className="font-semibold text-amber-600">Accommodations</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
            Indulge in our meticulously curated rooms and suites, where every
            detail speaks the language of sophisticated luxury and unparalleled
            comfort
          </p>
        </div>

        {error && (
          <div className="text-center text-red-500 mb-8">
            Failed to load rooms. Please try again later.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <RoomSkeleton key={i} />)
            : rooms.map((room) => (
                <div
                  key={room.id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100"
                >
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-4">
                          <HomeIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <p className="text-amber-600 font-semibold tracking-wide uppercase text-sm">
                          Room {room.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-light text-slate-800 mb-3 tracking-tight">
                      {room.name}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-6 font-light">
                      {room.description ||
                        'Experience the epitome of luxury with our meticulously designed accommodations featuring premium amenities.'}
                    </p>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-slate-600">
                        <Users className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">
                          Up to {room.capacity || 2} Guests
                        </span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Wifi className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">High-Speed Internet</span>
                      </div>
                      <div className="flex items-center text-slate-600">
                        <Coffee className="w-5 h-5 mr-3 text-amber-500" />
                        <span className="text-sm">Premium Amenities</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                      <div>
                        <p className="text-3xl font-light text-slate-800">
                          ${room.basePrice}
                        </p>
                        <p className="text-sm text-slate-500 font-light">
                          per night
                        </p>
                      </div>
                      <Link to={`/booking/${room.id}`}>
                        <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide">
                          Reserve Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <div className="text-center mt-16">
          <Link to="/our-rooms">
            <button className="bg-white border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 tracking-wide group">
              Discover All Suites
              <ChevronRight className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;
