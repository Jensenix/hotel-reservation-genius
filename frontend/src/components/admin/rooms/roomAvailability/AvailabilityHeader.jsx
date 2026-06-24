import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import Button from '@/components/common/Button';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';

const AvailabilityHeader = ({ selectedDate, setSelectedDate, setToday }) => {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-slate-800 mb-2 tracking-tight">
            Room <span className="font-semibold text-amber-600">Availability</span>
          </h1>
          <p className="text-slate-500 text-sm tracking-wide uppercase">
            Real-time Room Status & Management
          </p>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-amber-500"></div>
            <span className="text-amber-600 text-xs font-semibold tracking-widest">
              GENIUS SOCIETY HOTEL
            </span>
            <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-amber-500"></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm bg-white shadow-sm"
              />
            </div>
            <Button onClick={setToday} variant="secondary">
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