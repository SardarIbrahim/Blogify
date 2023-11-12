import { StatusCodes } from 'http-status-codes'

import cloudinary from 'cloudinary'

import Post from '../models/Post.js'
import Comment from '../models/Comment.js'

import BadRequestError from '../errors/badRequestError.js'
import mongoose from 'mongoose'

/**
 *
 * @param {create a post} req
 * @param {sending back the created post} res
 */
const createSinglePost = async (req, res) => {
  const user = req.user
  const { postTitle, postText } = req.body
  let { postImage } = req.body

  const postedBy = user._id

  if (!postTitle || !postText || !postImage) {
    throw new BadRequestError('Please provide title,image and text for post')
  }

  if (postImage.length > 0) {
    // upload
    const uploadedResponse = await cloudinary.uploader.upload(postImage)
    postImage = uploadedResponse.secure_url
  }

  const newPost = new Post({
    postTitle: postTitle,
    postText: postText,
    postImage: postImage,
    postedBy: postedBy,
  })

  await newPost.save()

  res.status(StatusCodes.CREATED).json({ newPost })
}

/**
 *
 * @param {get single post} req
 * @param {sending back the single post} res
 * @returns
 */
const getSinglePost = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ msg: `No post with id :${id}` })

  const singlePost = await Post.findOne({ _id: id })
    .populate([{ path: 'postedBy', select: 'name profilePic' }])
    .sort({ createdAt: -1 })

  if (!singlePost) throw new BadRequestError('No post found')

  const totalComments = await Comment.find({
    _id: { $in: singlePost.comments },
  })
    .populate('commentBy', 'name profilePic')
    .sort({ createdAt: -1 })
    .exec()

  if (!totalComments) {
    console.log('in comments')
    return res.status(StatusCodes.OK).json({ singlePost })
  }

  res.status(StatusCodes.OK).json({ singlePost, totalComments })
}

/**
 *
 * @param {get all posts} req
 * @param {sending back all posts} res
 * @returns
 */
const getAllPosts = async (req, res) => {
  // skip and limit
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  const allPosts = await Post.find({})
    .populate('postedBy', ['name', 'profilePic'])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  if (!allPosts) throw new BadRequestError('No posts available')

  res.status(200).json({ allPosts })
}

/**
 *
 * @param {like and unlike the post} req
 * @param {sending back updated post} res
 * @returns
 */
const likeAndUnlikeSinglePost = async (req, res) => {
  const user = req.user

  const { id } = req.params

  const singlePost = await Post.findById(id).populate([
    { path: 'postedBy', select: 'name' },
  ])

  if (!singlePost) throw new BadRequestError('Sorry! Post not found ')

  //   if like doesn't exists
  if (!singlePost.likes.includes(user._id)) {
    singlePost.likes.push(user._id.toString())
    await singlePost.save()
    return res.status(StatusCodes.OK).json({ singlePost })
  } else {
    // if like exists
    singlePost.likes = singlePost.likes.filter(
      (like) => like.toString() !== user._id.toString()
    )
    await singlePost.save()

    return res.status(StatusCodes.OK).json({ singlePost })
  }
}

/**
 *
 * @param {Comment on post} req
 * @param {sending back the comment added} res
 */

const commentOnSinglePost = async (req, res) => {
  const { id } = req.params
  const user = req.user

  const { commentText } = req.body

  const singlePost = await Post.findById(id)
  if (!singlePost) throw new BadRequestError('Sorry! Post not found ')

  if (!commentText) throw new BadRequestError('Please write something')

  const newComment = new Comment({
    commentBy: user._id,
    commentText,
  })

  await newComment.save()

  // adding this comment to our post as well
  singlePost.comments.push(newComment._id)

  //   save the single post as well
  singlePost.save()

  const totalComments = await Comment.find()
    .where('_id')
    .in(singlePost.comments)
    .populate('commentBy', 'name profilePic')
    .exec()

  res.status(StatusCodes.OK).json({ singlePost, totalComments })
}

/**
 *
 * @param {Delete a post} req
 * @param {returning remaining all posts} res
 */
const deleteSinglePost = async (req, res) => {
  const user = req.user

  const { id } = req.params

  const post = await Post.findById(id)

  if (!post) throw new BadRequestError('No Post Found')

  if (user._id.toString() !== post.postedBy.toString())
    throw new BadRequestError('User not authorized')

  const deletedPost = await Post.deleteOne({ _id: id })

  // skip and limit
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  const allPosts = await Post.find({})
    .populate('postedBy', ['name', 'profilePic'])
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  res.status(StatusCodes.OK).json({ allPosts })
}

export {
  createSinglePost,
  getSinglePost,
  getAllPosts,
  likeAndUnlikeSinglePost,
  commentOnSinglePost,
  deleteSinglePost,
}
