import { configureStore } from '@reduxjs/toolkit'

// logger
import { createLogger } from 'redux-logger'
const logger = createLogger()

import { userReducer } from '../features/users/userSlice'
import postsReducer from '../features/posts/postSlice'

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
  // middleware
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: false,
})

export default store
