import { useRef, useState } from 'react'

import { NavLink, Outlet } from 'react-router-dom'

import axios from 'axios'

import { toast } from 'react-toastify'

import { GrLogout } from 'react-icons/gr'
import { useDispatch } from 'react-redux'
import { removeUser } from '../features/users/userSlice'

const RootLayout = () => {
  const [log, setLog] = useState(false)
  // user
  const dispatch = useDispatch()

  // refs for responsive design
  const linksRef = useRef()
  const btnRef = useRef()

  // show menu
  const showMenu = (e) => {
    e.preventDefault()

    linksRef.current.classList.toggle('show')
    btnRef.current.classList.toggle('show')
  }

  // logout user
  const logoutUser = async () => {
    try {
      setLog((prevState) => !prevState)
      const { data } = await axios.post(
        '/api/v1/users/logout',
        {},
        { withCredentials: true }
      )
      toast.success(data.message)
      dispatch(removeUser(null))
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <>
      {/* Grid */}
      <section className='root__grid'>
        {/* left side */}
        <div className='left__grid'>
          {/* logo */}
          <h2 className='logo' onClick={showMenu}>
            Blogify
          </h2>

          {/* links */}
          <ul ref={linksRef}>
            <NavLink
              to={'/'}
              style={({ isActive }) => {
                return {
                  borderRight: isActive ? '1px solid burlywood' : '',
                }
              }}
            >
              Feed
            </NavLink>

            <NavLink
              to={'/create'}
              style={({ isActive }) => {
                return {
                  borderRight: isActive ? '1px solid burlywood' : '',
                }
              }}
            >
              Create
            </NavLink>

            <NavLink
              to={'/profile'}
              style={({ isActive }) => {
                return {
                  borderRight: isActive ? '1px solid burlywood' : '',
                }
              }}
            >
              Profile
            </NavLink>
          </ul>

          <button
            className='btn__logout'
            ref={btnRef}
            type='button'
            onClick={logoutUser}
            disabled={log ? true : false}
          >
            {log ? 'wait...' : 'Logout'} <GrLogout />
          </button>
        </div>

        {/* right side */}
        {/* children here */}
        <Outlet />
      </section>
    </>
  )
}

export default RootLayout
