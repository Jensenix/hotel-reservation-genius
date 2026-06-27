import { Link } from 'react-router-dom';
import { Camera, ChevronRight } from 'lucide-react';

const GallerySection = () => (
  <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-slate-50 to-white overflow-hidden w-full">
    <div className="container mx-auto px-4 max-w-7xl w-full">
      <div className="text-center mb-12 sm:mb-20">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-xs sm:text-sm font-semibold tracking-widest uppercase">Gallery</span>
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        {/* FIX: Responsive typography */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6 sm:mb-8 tracking-tight break-words">
          Experience <span className="font-semibold text-amber-600 block sm:inline">Luxury</span> Through Images
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Take a visual journey through our exquisite spaces and discover the elegance that awaits your arrival
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 w-full">
        {['Lobby', 'Suite', 'Restaurant', 'Pool', 'Spa', 'Bar', 'Garden', 'Conference'].map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 w-full"
          >
            <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center p-2">
              <div className="text-center">
                <div className="w-10 h-10 sm:w-16 sm:h-16 bg-white/80 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Camera className="w-5 h-5 sm:w-8 sm:h-8 text-slate-600" />
                </div>
                <p className="text-slate-700 font-semibold tracking-wide uppercase text-[10px] sm:text-sm truncate w-full px-1">{item}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12 sm:mt-16">
        <Link to="/#">
          <button className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-6 py-3 sm:px-12 sm:py-4 rounded-xl text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide group flex items-center justify-center mx-auto">
            View Full Gallery
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 inline transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  </section>
);

export default GallerySection;