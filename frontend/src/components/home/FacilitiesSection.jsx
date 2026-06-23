import { Wifi, Utensils, Dumbbell, Car } from 'lucide-react';

const FacilitiesSection = () => (
  <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
            Premium Amenities
          </span>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
          World-Class <span className="font-semibold text-amber-600">Facilities</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Indulge in our exceptional amenities designed to elevate your stay to extraordinary heights of luxury and comfort
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="group text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <Wifi className="w-12 h-12 text-amber-600" />
          </div>
          <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">High-Speed WiFi</h3>
          <p className="text-slate-600 leading-relaxed font-light">
            Complimentary ultra-high speed internet throughout the entire hotel premises
          </p>
        </div>

        <div className="group text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <Utensils className="w-12 h-12 text-emerald-600" />
          </div>
          <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">Fine Dining</h3>
          <p className="text-slate-600 leading-relaxed font-light">
            Award-winning restaurant serving exquisite international cuisine by master chefs
          </p>
        </div>

        <div className="group text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-600 to-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <Dumbbell className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">Fitness Center</h3>
          <p className="text-slate-600 leading-relaxed font-light">
            State-of-the-art gym with premium equipment and personal trainers
          </p>
        </div>

        <div className="group text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-lg">
            <Car className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">Valet Parking</h3>
          <p className="text-slate-600 leading-relaxed font-light">
            Secure valet parking service available 24/7 with concierge assistance
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default FacilitiesSection;