import { Star } from 'lucide-react';
import { testimonials } from '@/data/testimonialData';

/**
 * @returns {JSX.Element}
 */
const TestimonialsSection = () => (
  <section className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50 overflow-hidden w-full">
    <div className="container mx-auto px-4 max-w-7xl w-full">
      <div className="text-center mb-12 sm:mb-20">
        <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-6 sm:mb-8">
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-xs sm:text-sm font-semibold tracking-widest uppercase">
            Guest Voices
          </span>
          <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 mb-6 sm:mb-8 tracking-tight break-words">
          What Our{' '}
          <span className="font-semibold text-amber-600 block sm:inline">
            Guests Say
          </span>
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Discover why our guests return time and again to experience the
          unparalleled luxury and service at Genius Society Hotel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-12 w-full">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 hover:shadow-2xl transition-all duration-500 border border-slate-100 w-full"
          >
            <div className="flex items-center justify-center sm:justify-start mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-current"
                />
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 font-light italic text-base sm:text-lg text-center sm:text-left">
              &quot;{testimonial.content}&quot;
            </p>
            <div className="text-center sm:text-left">
              <p className="text-slate-800 font-semibold text-base sm:text-lg mb-1 sm:mb-2">
                {testimonial.name}
              </p>
              <p className="text-slate-500 text-xs sm:text-sm font-light">
                {testimonial.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
