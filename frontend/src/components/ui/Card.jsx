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
    xl: 'shadow-xl'
  };
  
  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    large: 'p-8'
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:scale-105 transform' : '';
  
  const classes = `${baseClasses} ${shadows[shadow]} ${paddings[padding]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
