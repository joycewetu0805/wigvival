export default function errorHandler(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  res.status(status).json({
    error: true,
    message: err.message || 'Erreur serveur'
  });
}
