import jwt from 'jsonwebtoken'

const sendTokenAndCookie = async (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })

  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    sameSite: 'strict',
  })

  return token
}

export default sendTokenAndCookie
