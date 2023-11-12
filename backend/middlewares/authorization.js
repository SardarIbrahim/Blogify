import User from '../models/User.js'

import jwt from 'jsonwebtoken'

const authMiddleware = async (req, res, next) => {
  try {
    const cookieToken = req.cookies.token

    if (!cookieToken)
      return res.status(404).json({ error: 'User not authorized' })

    const decode = jwt.verify(cookieToken, process.env.JWT_SECRET)

    const user = await User.findById(decode.userID)

    if (!user) return res.status(400).json({ error: 'User not authorized' })

    req.user = user

    next()
  } catch (error) {
    return res.status(404).json({ error: 'User not authorized' })
  }
}

export default authMiddleware
