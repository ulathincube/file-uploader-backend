function index(req, res, next) {
  res.status(200).json({ message: '!This is the file uploader api!' })
}

export { index }
