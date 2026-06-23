import { useFacilities } from '@/hooks/useFacilities';
import Loading from '@/components/ui/Loading';
import FacilitiesHero from '@/components/facilities/FacilitiesHero';
import FacilitiesCarousel from '@/components/facilities/FacilitiesCarousel';
import FacilityDetails from '@/components/facilities/FacilityDetails';
import FacilitiesGrid from '@/components/facilities/FacilitiesGrid';

const Facilities = () => {
  const { facilities, loading, selectedFacility, setSelectedFacility } = useFacilities();

  // Full-screen loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Premium Amenities</span>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
          <h1 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
            Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
          </h1>
          <Loading text="Discovering our world-class amenities..." size="lg" />
        </div>
      </div>
    );
  }

  // Full-screen empty state
  if (facilities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Premium Amenities</span>
            <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
          <h1 className="text-5xl font-light text-slate-800 mb-6 tracking-tight">
            Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
          </h1>
          <p className="text-xl text-slate-600 font-light">
            Our exceptional facilities are being prepared for your arrival
          </p>
        </div>
      </div>
    );
  }

  // Main Page Render
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
      <div className="container mx-auto px-4">
        
        <FacilitiesHero />
        
        <FacilitiesCarousel 
          facilities={facilities} 
          onSelectFacility={setSelectedFacility} 
        />
        
        <FacilityDetails 
          facility={selectedFacility} 
          onClose={() => setSelectedFacility(null)} 
        />
        
        <FacilitiesGrid 
          facilities={facilities} 
          onSelectFacility={setSelectedFacility} 
        />

      </div>
    </div>
  );
};

export default Facilities;