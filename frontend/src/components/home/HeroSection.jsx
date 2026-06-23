import { Link } from 'react-router-dom';
import Button from '@/components/common/Button';
import { Sparkles, MapPin, Star, Shield } from 'lucide-react';
import { ImageAssets } from '@/config';

const HeroSection = () => (
  <section
    className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat -mt-32"
    style={{
      backgroundImage:
        `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url(${ImageAssets.HomeWallpaper})`,
    }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black/70"></div>
    <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span className="text-lg font-light tracking-wider text-yellow-400">LUXURY & COMFORT</span>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">Genius Society Hotel</h1>
        <p className="text-xl md:text-2xl mb-8 font-light leading-relaxed">
          Where elegance meets exceptional service in the heart of the city
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
        <Link to="/facilities">
          <Button
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-4 text-lg font-semibold shadow-xl border-2 border-amber-400"
          >
            Explore Facilities
          </Button>
        </Link>
        <Link to="/our-rooms">
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold"
          >
            Make Reservation
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-center space-x-8 text-white/80">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5" />
          <span className="text-sm">123 Luxury Ave, Paradise City</span>
        </div>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-yellow-400" />
          <span className="text-sm">5-Star Luxury</span>
        </div>
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span className="text-sm">Premium Service</span>
        </div>
      </div>
    </div>
  </section>
);

export default HeroSection;