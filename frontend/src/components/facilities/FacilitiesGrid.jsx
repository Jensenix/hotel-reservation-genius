import PropTypes from 'prop-types';

const FacilitiesGrid = ({ facilities, onSelectFacility }) => {
  const handleKeyDown = (e, facility) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevents page scroll down on Space
      onSelectFacility(facility);
    }
  };

  return (
    <div className="pb-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-light text-slate-800 mb-4 tracking-tight">
          All <span className="font-semibold text-amber-600">Premium Facilities</span>
        </h2>
        <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto">
          Explore our complete collection of world-class amenities designed for your ultimate comfort
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {facilities.map((facility) => (
          // ACCESSIBILITY FIX: Added role, tabIndex, and onKeyDown
          <div
            key={facility.id}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:scale-105 border border-slate-100 overflow-hidden focus:outline-none focus:ring-4 focus:ring-amber-500 focus:border-transparent"
            role="button"
            tabIndex={0}
            onClick={() => onSelectFacility(facility)}
            onKeyDown={(e) => handleKeyDown(e, facility)}
          >
            <div className="h-48 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/90 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-2xl font-bold text-amber-600">
                      {facility.facilityName?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <p className="text-white font-semibold tracking-wide text-sm">Premium</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-light text-slate-800 mb-3 tracking-tight">
                {facility.facilityName || 'Luxury Facility'}
              </h3>
              <p className="text-slate-600 leading-relaxed font-light mb-6 line-clamp-2">
                {facility.iconUrl
                  ? `Premium ${facility.iconUrl} facility`
                  : 'Experience luxury and comfort in our premium facilities'}
              </p>
              {/* Note: The button inside the div now acts purely as a visual indicator. 
                  Since the parent <div> is accessible, we set tabIndex={-1} here to prevent "double-tabbing" into the same interactive element. */}
              <button
                tabIndex={-1}
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 border-0 tracking-wide text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectFacility(facility);
                }}
              >
                Discover More
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

FacilitiesGrid.propTypes = {
  facilities: PropTypes.array.isRequired,
  onSelectFacility: PropTypes.func.isRequired,
};

export default FacilitiesGrid;