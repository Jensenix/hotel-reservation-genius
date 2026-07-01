import PropTypes from 'prop-types';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.hover]
 * @param {'none'|'sm'|'md'|'lg'|'xl'} [props.shadow]
 * @param {'none'|'small'|'normal'|'large'} [props.padding]
 * @returns {JSX.Element}
 */
const Card = ({
  children,
  className = '',
  hover = false,
  shadow = 'md',
  padding = 'normal',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl transition-all duration-300';

  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8',
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 transform' : '';

  const classes = `${baseClasses} ${shadows[shadow]} ${paddings[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  padding: PropTypes.oneOf(['none', 'small', 'normal', 'large']),
};

export default Card;
