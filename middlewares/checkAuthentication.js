function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) return next()
}

export default checkAuthentication
