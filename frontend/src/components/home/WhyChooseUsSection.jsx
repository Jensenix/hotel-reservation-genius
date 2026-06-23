import { Home as HomeIcon, MapPin, Shield } from 'lucide-react';

const WhyChooseUsSection = () => (
  <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/10 to-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-24">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">
            The Genius Difference
          </span>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
          The <span className="font-semibold text-amber-600">Genius Society</span> Experience
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Discover what sets us apart and transforms every stay into an unforgettable journey of luxury and exceptional service
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div className="text-center group">
          <div className="w-28 h-28 bg-gradient-to-br from-amber-50 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-amber-200">
            <HomeIcon className="w-14 h-14 text-amber-600" />
          </div>
          <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">Luxury Accommodations</h3>
          <p className="text-slate-600 leading-relaxed font-light text-lg">
            Experience world-class facilities and premium services designed for your ultimate comfort and relaxation beyond imagination
          </p>
        </div>

        <div className="text-center group">
          <div className="w-28 h-28 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-emerald-200">
            <MapPin className="w-14 h-14 text-emerald-600" />
          </div>
          <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">Prime Location</h3>
          <p className="text-slate-600 leading-relaxed font-light text-lg">
            Located in the heart of the city with exclusive access to premier attractions, business districts, and entertainment venues
          </p>
        </div>

        <div className="text-center group">
          <div className="w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-10 group-hover:scale-110 transition-all duration-500 shadow-xl border-4 border-slate-500">
            <Shield className="w-14 h-14 text-white" />
          </div>
          <h3 className="text-3xl font-light text-slate-800 mb-6 tracking-tight">Exceptional Service</h3>
          <p className="text-slate-600 leading-relaxed font-light text-lg">
            Our dedicated staff ensures your stay is nothing short of perfect with personalized attention to every detail and desire
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default WhyChooseUsSection;