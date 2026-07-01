import { CheckCircle, Star, Shield } from 'lucide-react';

/**
 * @returns {JSX.Element}
 */
const FacilitiesHero = () => (
  <section className="py-12 sm:py-20 w-full overflow-hidden">
    <div className="text-center mb-10 sm:mb-20 px-4">
      <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
        <span className="text-amber-600 text-xs sm:text-sm font-semibold tracking-widest uppercase">
          Premium Amenities
        </span>
        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-slate-800 mb-6 sm:mb-8 tracking-tight break-words">
        Our{' '}
        <span className="font-semibold text-amber-600 block sm:inline">
          Luxury Facilities
        </span>
      </h1>
      <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light mb-8 sm:mb-12">
        Experience world-class amenities meticulously designed to elevate your
        stay to extraordinary heights of comfort and sophistication
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 w-full max-w-3xl mx-auto">
        <div className="w-full sm:w-auto flex items-center justify-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium tracking-wide text-sm sm:text-base">
            24/7 Service
          </span>
        </div>
        <div className="w-full sm:w-auto flex items-center justify-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <Star className="w-5 h-5 shrink-0" />
          <span className="font-medium tracking-wide text-sm sm:text-base">
            Premium Quality
          </span>
        </div>
        <div className="w-full sm:w-auto flex items-center justify-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <Shield className="w-5 h-5 shrink-0" />
          <span className="font-medium tracking-wide text-sm sm:text-base">
            Safe & Clean
          </span>
        </div>
      </div>
    </div>
  </section>
);

export default FacilitiesHero;
