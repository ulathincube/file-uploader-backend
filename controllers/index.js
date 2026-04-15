import User from '../models/User.js'

async function index(req, res, next) {
  const user = await User.findUserById(1)

  res
    .status(200)
    .json({ message: '!This is the file uploader api!', erro: null })
}

export { index }
