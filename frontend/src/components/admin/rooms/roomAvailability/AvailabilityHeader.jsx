import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import Button from '@/components/ui/Button';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';

/**
 * Custom hook to detect if the viewport width is mobile size (< 768px)
 * @returns {boolean} true if viewport width is less than 768px, false otherwise
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768,
  );

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return isMobile;
};

/**
 * @returns {boolean}
 */
const AvailabilityHeader = ({ selectedDate, setSelectedDate, setToday }) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-light text-slate-800 mb-2 tracking-tight">
            Room{' '}
            <span className="font-semibold text-amber-600">Availability</span>
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm tracking-wide uppercase">
            Real-time Room Status & Management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-xs font-semibold tracking-widest">
              GENIUS SOCIETY HOTEL
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <div className="relative w-full sm:w-auto">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select date"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm cursor-pointer text-center md:text-left"
                  withPortal={isMobile}
                  popperPlacement={isMobile ? undefined : 'bottom-start'}
                  portalId={isMobile ? undefined : 'root'}
                  popperProps={isMobile ? undefined : { strategy: 'fixed' }}
                />
              </div>
            </div>
            <Button onClick={setToday} variant="secondary" className="shrink-0">
              Today
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

AvailabilityHeader.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  setToday: PropTypes.func.isRequired,
};

export default AvailabilityHeader;
