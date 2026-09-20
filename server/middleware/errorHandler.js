module.exports = function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "Internal Server Error";

  const response = {
    success: false,
    error: {
      code,
      message,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
