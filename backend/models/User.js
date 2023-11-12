import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'please provide your name'],
      minlength: 3,
      maxlength: 20,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'please provide your email'],
      unique: [true, 'Please provide any other email'],
    },

    profilePic: {
      type: String,
      default: '',
    },

    password: {
      type: String,
      required: [true, 'please provide your password'],
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', UserSchema)

export default User
