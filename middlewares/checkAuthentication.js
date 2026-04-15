function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) return next()
  throw new Error('You are not authenticated!')
}

export default checkAuthentication
