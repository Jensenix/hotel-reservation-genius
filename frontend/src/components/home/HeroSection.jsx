import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Sparkles, MapPin, Star, Shield } from 'lucide-react';
import { ImageAssets } from '@/config';

const HeroSection = () => (
  <section
    className="relative min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-120px)] flex items-center justify-center bg-cover bg-center bg-no-repeat w-full overflow-hidden"
    style={{
      backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${ImageAssets.HomeWallpaper})`,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto w-full">
      <div className="mb-8 w-full">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
          <span className="text-sm sm:text-lg font-light tracking-wider text-yellow-400">
            LUXURY & COMFORT
          </span>
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 shrink-0" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight break-words whitespace-normal">
          Genius Society Hotel
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl mb-8 font-light leading-relaxed max-w-2xl mx-auto break-words whitespace-normal">
          Where elegance meets exceptional service in the heart of the city
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-10 sm:mb-12 w-full px-4 sm:px-0">
        <Link to="/facilities" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-base sm:text-lg font-semibold shadow-xl border-2 border-amber-400"
          >
            Explore Facilities
          </Button>
        </Link>
        <Link to="/our-rooms" className="w-full sm:w-auto">
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-base sm:text-lg font-semibold"
          >
            Make Reservation
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/80 w-full px-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-sm sm:text-base text-center">123 Luxury Ave, Paradise City</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0" />
          <span className="text-sm sm:text-base text-center">5-Star Luxury</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
          <span className="text-sm sm:text-base text-center">Premium Service</span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;