import { matchedData, body, validationResult } from 'express-validator'
import passport from 'passport'
import { SALTROUNDS } from '../config/constants.js'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .isEmail()
    .escape()
    .withMessage('Please provide a valid email address.'),
  body('password')
    .trim()
    .notEmpty()
    .escape('')
    .withMessage(
      'Please provide a valid password with 8 - 16 characters in length!',
    ),
]

const validateRegister = [
  body('name').trim().notEmpty().withMessage('Please provide a Name'),
  body('email')
    .trim()
    .notEmpty()
    .custom(async (email, { req }) => {
      const user = await User.findUserByEmail(email)
      if (user) throw new Error('Email already in use!')
      return true
    })
    .withMessage('Please provide a valid email address!'),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Please provide a valid password'),
]

async function login(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      throw new Error('Please provide a valid email address and password!')
    }

    const { email, password } = matchedData(req)

    passport.authenticate('local', { session: true }, (error, user, info) => {
      if (error) return next(error)

      req.login(user, (error) => {
        if (error) return next(error)
        delete user.password
        return res.status(200).json(user)
      })
    })(req, res, next)
  } catch (error) {
    throw error
  }
}

async function register(req, res, next) {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) throw new Error('Invalid user data. Try again!')

    const { name, email, password } = matchedData(req)
    const salt = await bcrypt.genSalt(SALTROUNDS)

    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await User.createUser({
      email,
      password: hashedPassword,
      name,
    })

    delete newUser.password

    res.status(200).json(newUser)
  } catch (error) {
    next(error)
  }
}

export const registerUser = [...validateRegister, register]

export const loginUser = [...validateLogin, login]
