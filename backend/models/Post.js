import mongoose from 'mongoose'

const PostSchema = mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    postTitle: {
      type: String,
      required: [true, 'Please provide the title for post.'],
    },

    postText: {
      type: String,
      required: [true, 'Please enter something to post.'],
    },

    postImage: {
      type: String,
      required: [true, 'Please provide the image for post.'],
    },

    likes: {
      type: [String],
      default: [],
    },

    comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', PostSchema)

export default Post
