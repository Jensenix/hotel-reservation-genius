import { Star, CheckCircle, Wifi, Shield } from 'lucide-react';

const OurRoomsHero = () => {
  return (
    <section className="relative py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Star className="w-6 h-6 text-amber-500" />
            <span className="text-lg font-light tracking-wider text-amber-600">
              LUXURY ACCOMMODATIONS
            </span>
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Our Rooms & Suites
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience unparalleled comfort and elegance in our meticulously
            designed rooms and suites
          </p>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <div className="flex items-center space-x-2 text-amber-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Premium Comfort</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-600">
              <Wifi className="w-5 h-5" />
              <span className="font-medium">Modern Amenities</span>
            </div>
            <div className="flex items-center space-x-2 text-amber-600">
              <Shield className="w-5 h-5" />
              <span className="font-medium">5-Star Service</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurRoomsHero;