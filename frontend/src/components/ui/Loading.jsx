import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {string} [props.text]
 * @param {string} [props.className]
 * @returns {JSX.Element}
 */
const Loading = ({ size = 'md', text = 'Loading...', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-blue-600 border-t-transparent animate-spin rounded-full`}
      >
        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

Loading.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  text: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;
