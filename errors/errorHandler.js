function errorHandler(error, req, res, next) {
  console.dir(error)
  return res.status(500).json({
    error: error.message,
    data: null,
  })
}

export default errorHandler
