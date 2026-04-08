function errorHandler(error, req, res, next) {
  console.log(error.message, error.name)
  next(error)
}

export default errorHandler
