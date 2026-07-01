import PropTypes from 'prop-types';
import { ImageAssets } from '@/config';

const AuthHeader = ({ title, highlight, subtitle }) => {
  return (
    <div className="text-center mb-8 relative">
      <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
        <img src={ImageAssets.HotelLogo} alt="Hotel Logo" className="w-full h-full object-contain" />
      </div>
      <h1 className="text-3xl font-light text-slate-800 mb-2 tracking-tight">
        {title} <span className="font-semibold text-amber-600">{highlight}</span>
      </h1>
      <p className="text-slate-500 text-sm tracking-wide uppercase">{subtitle}</p>
    </div>
  );
};

AuthHeader.propTypes = {
  title: PropTypes.string.isRequired,
  highlight: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
};

export default AuthHeader;