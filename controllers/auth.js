import { matchedData, body, validationResult } from 'express-validator'
import passport from 'passport'

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
        return res.status(200).json({ message: 'Logged In!' })
      })
    })(req, res, next)
  } catch (error) {
    throw error
  }
}

export const loginUser = [...validateLogin, login]
