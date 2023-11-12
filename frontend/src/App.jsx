import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import RootLayout from './pages/RootLayout'
import CreatePostPage from './pages/CreatePostPage'
import ProfilePage from './pages/ProfilePage'
import AllPostsPage, { fetchFeedLoader } from './pages/AllPostsPage'
import SinglePostPage, { fetchSinglePost } from './pages/SinglePostPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProtectedRoute from './pages/ProtectedRoute'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import ErrorPage from './errors/ErrorPage'

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* protected routes */}
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <RootLayout />
            </ProtectedRoute>
          }
          errorElement={<ErrorPage />}
        >
          <Route index element={<AllPostsPage />} loader={fetchFeedLoader} />
          <Route
            path='post/:pid'
            element={<SinglePostPage />}
            loader={fetchSinglePost}
          />
          <Route path='create' element={<CreatePostPage />} />
          <Route path='profile' element={<ProfilePage />} />
        </Route>

        {/* signup and login */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='*' element={<ErrorPage />} />
      </>
    )
  )

  return (
    <>
      <ToastContainer
        position='top-right'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        draggable={true}
        theme='dark'
        className={'toast__message'}
      />
      {/* providing the router */}
      <RouterProvider router={router} />
    </>
  )
}

export default App
