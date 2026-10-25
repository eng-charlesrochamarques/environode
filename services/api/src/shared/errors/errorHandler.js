export function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || (error.name === "ValidationError" || error.name === "CastError" ? 400 : error.code === 11000 ? 409 : 500);

  if (statusCode >= 500) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message: statusCode >= 500 ? "Erro interno do servidor." : error.message
    }
  });
}
