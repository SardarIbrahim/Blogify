import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  user: JSON.parse(localStorage.getItem('blogger')) || null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,

  reducers: {
    setUser(state, action) {
      state.loading = true
      state.user = action.payload

      //   set user in local storage
      localStorage.setItem('blogger', JSON.stringify(state.user))
      state.loading = false
    },

    removeUser(state, action) {
      state.loading = true
      state.user = action.payload

      //   set user in local storage
      localStorage.removeItem('blogger')
      state.loading = false
    },
  },
})

export const userReducer = userSlice.reducer
export const { setUser, removeUser } = userSlice.actions
