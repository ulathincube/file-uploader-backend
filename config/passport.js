import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const options = {
  usernameField: 'email',
  passwordField: 'password',
}

async function strategyVerify(email, password, done) {
  try {
    const user = await User.findUserByEmail(email)

    if (!user)
      return done(null, false, {
        message: 'Incorrect username or password',
      })

    // const match = await bcrypt.compare(password, user.password)
    const match = password === user.password

    if (!match)
      return done(null, false, {
        message: 'Incorrect username or password',
      })

    return done(null, user)
  } catch (error) {
    return done(error)
  }
}

const newLocalStrategy = new LocalStrategy(options, strategyVerify)

passport.use(newLocalStrategy)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findUserById(id)
    if (!user) return done(null, false)
    done(null, user)
  } catch (error) {
    done(error, null)
  }
})
