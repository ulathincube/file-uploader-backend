function notFound(req, res, next) {
  res.status(404).json({ error: 'Resource not found. Try again' })
}

export default notFound
