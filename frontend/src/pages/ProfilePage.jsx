import { useRef } from 'react'

import { useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'
import { profileSchema } from '../schemas/signup'

import Avatar from 'react-avatar'

import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/users/userSlice'

import useImg from '../hooks/useImg'

import { toast } from 'react-toastify'
import { BsUpload } from 'react-icons/bs'

import styles from '../styles/profile.module.css'

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // initial values
  const initialValues = {
    name: user.name,
    email: user.email,
    password: '',
    confirmpassword: '',
  }

  // base64 img conversion
  const { imgUrl, handleImageChange } = useImg()

  // file Ref
  const fileRef = useRef()

  // formik
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: profileSchema,
      onSubmit: async (values, action) => {
        /**
         * Submit Form
         */
        const { name, email, password } = values
        try {
          const { data } = await axios.post(
            `/api/v1/users/update/${user._id}`,
            {
              name,
              email,
              password,
              profilePic: imgUrl,
            },
            { withCredentials: true }
          )

          // dispatch action
          dispatch(setUser(data.updatedUser))
          toast.success('Account updated successfully')
          navigate('/')
        } catch (error) {
          toast.error(error.response.data.message)
        }

        // reset form
        // action.resetForm()
      },
    })

  return (
    <div className='right__grid'>
      <div className={styles.form__container}>
        <h1>Profile</h1>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* profilePic */}
          <div className={styles.avatar}>
            <Avatar
              src={imgUrl || user.profilePic}
              className={styles.avatar}
              name={user.name}
              round={true}
              style={{
                width: '150px',
                height: '100px',
                borderRadius: '50%',
              }}
              onClick={() => fileRef.current.click()}
            />

            <input
              type='file'
              name='profilePic'
              id='profilePic'
              onChange={handleImageChange}
              ref={fileRef}
              title=' '
            />
          </div>

          {/*  Name  */}
          <div>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              placeholder='username'
              name='name'
              id='name'
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.name && touched.name ? (
              <p className={styles.form__error}> {errors.name} </p>
            ) : null}
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              name='email'
              id='email'
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && touched.email ? (
              <p className={styles.form__error}> {errors.email} </p>
            ) : null}
          </div>

          {/* Password */}
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              placeholder='*****'
              name='password'
              id='password'
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && touched.password ? (
              <p className={styles.form__error}> {errors.password} </p>
            ) : null}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor='confirmpassword'>Confirm Password</label>
            <input
              type='password'
              placeholder='*****'
              name='confirmpassword'
              id='confirmpassword'
              value={values.confirmpassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            {errors.confirmpassword && touched.confirmpassword ? (
              <p className={styles.form__error}> {errors.confirmpassword} </p>
            ) : null}
          </div>

          {/* button */}
          <button
            type='submit'
            style={{ fontSize: '1.5rem', padding: '1.5rem' }}
          >
            Update{' '}
            <span style={{ verticalAlign: 'middle' }}>
              <BsUpload />
            </span>{' '}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
