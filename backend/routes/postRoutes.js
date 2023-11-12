import express from 'express'
const router = express.Router()

// auth
import authMiddleware from '../middlewares/authorization.js'

// controller functions
import {
  commentOnSinglePost,
  createSinglePost,
  deleteSinglePost,
  getAllPosts,
  getSinglePost,
  likeAndUnlikeSinglePost,
} from '../controllers/postController.js'

// get the post
router.route('/').get(authMiddleware, getAllPosts)
router.route('/post/:id').get(authMiddleware, getSinglePost)

// like and comment
router.route('/post/:id').post(authMiddleware, likeAndUnlikeSinglePost)
router.route('/post/:id/comment').post(authMiddleware, commentOnSinglePost)

// delete post
router.route('/post/:id/delete').delete(authMiddleware, deleteSinglePost)
router.route('/create').post(authMiddleware, createSinglePost)
export default router
