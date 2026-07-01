import { Star } from 'lucide-react';

/**
 * @returns {JSX.Element}
 */
const RoomSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
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
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-amber-100 to-amber-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-amber-200 rounded mb-3"></div>
                  <div className="h-4 bg-amber-100 rounded mb-2"></div>
                  <div className="h-4 bg-amber-100 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomSkeleton;
