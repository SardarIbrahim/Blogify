import { StatusCodes } from 'http-status-codes'

const errorMiddleware = (err, req, res, next) => {
  const defaultError = {
    statuscode: err.StatusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Something went wrong, try again later',
  }

  // mongoose errors for required
  if (err.name === 'ValidationError') {
    defaultError.statuscode = StatusCodes.BAD_REQUEST
    defaultError.message = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')
  }

  // mongoose errors for unique
  if (err.code && err.code === 11000) {
    defaultError.statuscode = StatusCodes.BAD_REQUEST
    defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`
  }
  res.status(defaultError.statuscode).json({ message: defaultError.message })
}

export default errorMiddleware
