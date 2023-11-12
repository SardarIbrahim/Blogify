import mongoose from 'mongoose'

const CommentSchema = mongoose.Schema({
  commentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  commentText: {
    type: 'String',
    required: [true, 'Please write something'],
  },
})

const Comment = mongoose.model('Comment', CommentSchema)

export default Comment
