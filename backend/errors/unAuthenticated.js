import { StatusCodes } from 'http-status-codes'
import CustomAPIError from './customError.js'

class unAuthenticatedError extends CustomAPIError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

export default unAuthenticatedError
