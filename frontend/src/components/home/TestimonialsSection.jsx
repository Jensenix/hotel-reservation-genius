import { Star } from 'lucide-react';
import { testimonials } from '@/data/testimonialData';

const TestimonialsSection = () => (
  <section className="py-24 bg-gradient-to-br from-slate-50 via-amber-50/20 to-slate-50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-20">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
          <span className="text-amber-600 text-sm font-semibold tracking-widest uppercase">Guest Voices</span>
          <div className="w-16 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
        </div>
        <h2 className="text-5xl font-light text-slate-800 mb-8 tracking-tight">
          What Our <span className="font-semibold text-amber-600">Guests Say</span>
        </h2>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light">
          Discover why our guests return time and again to experience the unparalleled luxury and service at Genius Society Hotel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-500 border border-slate-100"
          >
            <div className="flex items-center mb-6">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-current" />
              ))}
            </div>
            <p className="text-slate-600 leading-relaxed mb-6 font-light italic text-lg">
              &quot;{testimonial.content}&quot;
            </p>
            <div className="text-center">
              <p className="text-slate-800 font-semibold text-lg mb-2">{testimonial.name}</p>
              <p className="text-slate-500 text-sm font-light">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;