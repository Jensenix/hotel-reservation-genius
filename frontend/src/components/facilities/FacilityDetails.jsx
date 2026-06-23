import { Star, Clock, Shield } from 'lucide-react';
import PropTypes from 'prop-types';

const FacilityDetails = ({ facility, onClose }) => {
  if (!facility) return null;

  return (
    <div className="mb-24">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div>
            <div className="h-80 bg-gradient-to-br from-amber-400 to-amber-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/90 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                    <span className="text-6xl font-bold text-amber-600">
                      {facility.facilityName?.charAt(0) || 'F'}
                    </span>
                  </div>
                  <p className="text-white font-semibold tracking-wide text-xl">
                    Premium Facility
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-12">
            <h2 className="text-4xl font-light text-slate-800 mb-6 tracking-tight">
              {facility.facilityName || 'Luxury Facility'}
            </h2>
            <div className="prose prose-lg text-slate-600 mb-8">
              <p className="leading-relaxed font-light text-lg">
                {facility.iconUrl
                  ? `Exclusive facility featuring premium ${facility.iconUrl} services`
                  : 'Experience unparalleled luxury and sophistication in our premium facilities, meticulously designed to provide the ultimate comfort and convenience for our most discerning guests'}
              </p>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center space-x-3 text-amber-600">
                <Star className="w-5 h-5 fill-current" />
                <span className="font-medium tracking-wide">5-Star Premium Service</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium tracking-wide">24/7 Availability</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-600">
                <Shield className="w-5 h-5" />
                <span className="font-medium tracking-wide">Premium Quality Assurance</span>
              </div>
            </div>
            <div className="mt-8">
              <button
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide"
                onClick={onClose}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

FacilityDetails.propTypes = {
  facility: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default FacilityDetails;