const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate Entry',
      details: err.errors.map((e) => e.message),
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Foreign Key Constraint Error',
      details: err.message,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;