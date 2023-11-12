import bcrypt from 'bcryptjs'
import cloudinary from 'cloudinary'
import { StatusCodes } from 'http-status-codes'
// model
import User from '../models/User.js'

// errors
import BadRequestError from '../errors/badRequestError.js'
import unAuthenticatedError from '../errors/unAuthenticated.js'

// token and cookie
import sendTokenAndCookie from '../utils/createCookie.js'

const userSignup = async function (req, res) {
  const { name, email, password } = req.body

  if (!name || !email || !password)
    throw new BadRequestError('Please provide complete credentials')

  const prevUser = await User.findOne({ email })

  if (prevUser) {
    throw new BadRequestError('please login')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  })

  await newUser.save()

  // generate token and send response
  await sendTokenAndCookie(newUser._id, res)

  res.status(StatusCodes.CREATED).json({
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    profilePic: newUser.profilePic,
  })
}

const userLogin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password)
    throw new BadRequestError('Please provide complete credentials')

  const prevUser = await User.findOne({ email })

  if (!prevUser) throw new BadRequestError('Please create your account first')

  // decrypt and compare the password
  const hashedPassword = await bcrypt.compare(password, prevUser.password)

  if (!hashedPassword) throw new unAuthenticated('Incorrect Password')

  // generate token and send response
  await sendTokenAndCookie(prevUser._id, res)

  res.status(StatusCodes.CREATED).json({
    _id: prevUser._id,
    name: prevUser.name,
    email: prevUser.email,
    profilePic: prevUser.profilePic,
  })
}

const updateProfile = async (req, res) => {
  const { userID } = req.params
  const user = req.user

  const { name, email, password } = req.body
  let { profilePic } = req.body

  if (userID !== user._id.toString()) {
    throw new unAuthenticatedError('You are not authorized')
  }

  if (profilePic) {
    // destroying old profile pic
    if (user.profilePic) {
      try {
        await cloudinary.uploader.destroy(
          user.profilePic.split('/').pop().split('.')[0]
        )
      } catch (error) {
        throw new BadRequestError(error.message)
      }
    }

    // upload new profile pic
    const uploadedResponse = await cloudinary.uploader.upload(profilePic)
    profilePic = uploadedResponse.secure_url
  }

  if (password) {
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    user.password = hashedPassword
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      name: name || user.name,
      email: email || user.email,
      password: user.password,
      profilePic: profilePic || user.profilePic,
    },
    {
      runValidators: true,
      new: true,
    }
  ).select('-password')

  res.status(StatusCodes.OK).json({ updatedUser })
}

// get profle
const getUserProfile = async (req, res) => {
  const { id } = req.params

  const user = await User.findOne({ _id: id })

  if (!user) throw new Error('No such user found')

  res.status(StatusCodes.OK).json({ user })
}

const logoutUser = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 1 })
    res.status(StatusCodes.OK).json({ message: 'Logged Out' })
  } catch (error) {
    console.log(error.message)
  }
}

export { userSignup, userLogin, updateProfile, getUserProfile, logoutUser }
