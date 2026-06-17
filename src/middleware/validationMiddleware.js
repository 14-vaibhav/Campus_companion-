module.exports = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      return res.status(400).json({
        error: {
          message: 'Validation Error',
          details: errorDetails
        }
      });
    }

    req.body = value;
    next();
  };
};
