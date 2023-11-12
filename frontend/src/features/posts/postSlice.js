import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  posts: [],
}

const postSlice = createSlice({
  name: 'posts',

  initialState,
  reducers: {
    setPostsFeed(state, action) {
      state.loading = true
      state.posts = action.payload
      state.loading = false
    },
  },
})

export default postSlice.reducer

export const { setPostsFeed } = postSlice.actions
