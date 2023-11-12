import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('DB IS UP')
  } catch (error) {
    console.log('Error connecting DB\n' + error.message)
    process.exit(1)
  }
}

export default connectDb
