import express from 'express'
const router = express.Router()

// controller functions
import {
  userSignup,
  userLogin,
  updateProfile,
  logoutUser,
  getUserProfile,
} from '../controllers/userController.js'
import authMiddleware from '../middlewares/authorization.js'

// registration and login
router.route('/register').post(userSignup)
router.route('/login').post(userLogin)

// get profile
router.route('/profile/:id').get(authMiddleware, getUserProfile)

// update profile
router.route('/update/:userID').post(authMiddleware, updateProfile)

// logout user
router.route('/logout').post(authMiddleware, logoutUser)

export default router
