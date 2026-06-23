import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, ChevronRight } from 'lucide-react';

const GallerySection = () => (
  <section className="py-24 bg-gradient-to-br from-white via-slate-50 to-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Gallery</span>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
          Experience <span className="font-semibold text-amber-600">Luxury</span> Through Images
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Take a visual journey through our exquisite spaces and discover the elegance that awaits your arrival
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {['Lobby', 'Suite', 'Restaurant', 'Pool', 'Spa', 'Bar', 'Garden', 'Conference'].map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500"
          >
            <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-700 font-semibold tracking-wide uppercase text-sm">{item}</p>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>

      <div className="text-center mt-16">
        <Link to="/#">
          <button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-12 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 border-0 tracking-wide group">
            View Full Gallery
            <ChevronRight className="w-5 h-5 ml-2 inline transition-transform group-hover:translate-x-1" />
          </button>
        </Link>
      </div>
    </div>
  </section>
);

export default GallerySection;