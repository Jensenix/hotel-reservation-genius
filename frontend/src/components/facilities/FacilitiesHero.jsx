import { CheckCircle, Star, Shield } from 'lucide-react';

const FacilitiesHero = () => (
  <section className="py-20">
    <div className="text-center mb-20">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
        <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
          Premium Amenities
        </span>
        <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
      </div>
      <h1 className="text-6xl font-light text-slate-800 mb-8 tracking-tight">
        Our <span className="font-semibold text-amber-600">Luxury Facilities</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light mb-12">
        Experience world-class amenities meticulously designed to elevate
        your stay to extraordinary heights of comfort and sophistication
      </p>
      <div className="flex items-center justify-center space-x-8">
        <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium tracking-wide">24/7 Service</span>
        </div>
        <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <Star className="w-5 h-5" />
          <span className="font-medium tracking-wide">Premium Quality</span>
        </div>
        <div className="flex items-center space-x-3 text-amber-600 bg-white/80 px-6 py-3 rounded-full shadow-lg">
          <Shield className="w-5 h-5" />
          <span className="font-medium tracking-wide">Safe & Clean</span>
        </div>
      </div>
    </div>
  </section>
);

export default FacilitiesHero;