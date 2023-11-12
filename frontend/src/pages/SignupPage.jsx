import { NavLink, Navigate, useNavigate } from 'react-router-dom'

import { useFormik } from 'formik'
import { signupSchema } from '../schemas/signup'

import axios from 'axios'

import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../features/users/userSlice'

import { toast } from 'react-toastify'
import { BsArrowRight } from 'react-icons/bs'

import styles from '../styles/signup.module.css'
import { useState } from 'react'

const initialValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
}

const SignupPage = () => {
  const { user } = useSelector((state) => state.user)

  const [sign, setSign] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // formik
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: signupSchema,
      onSubmit: async (values, action) => {
        setSign((prevState) => !prevState)
        /**
         * Submit Form
         */
        const { name, email, password } = values
        try {
          const { data } = await axios.post('/api/v1/users/register', {
            name,
            email,
            password,
          })

          // dispatch action
          dispatch(setUser(data))
          navigate('/')
        } catch (error) {
          console.log(error)
          toast.error('Account already exists')
        }

        // reset form
        // action.resetForm()
      },
    })

  if (user) {
    return <Navigate to={'/'} />
  }

  return (
    <section className={styles.section}>
      <div className={styles.form__container}>
        <h1>Signup</h1>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          {/*  Name  */}
          <div>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              placeholder='name'
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
              placeholder='email'
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
            <label htmlFor='password'>Pasword</label>
            <input
              type='password'
              placeholder='password'
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
              placeholder='confirm password'
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
            disabled={sign ? true : false}
          >
            {sign ? 'Wait...' : 'Register'}
            <span style={{ verticalAlign: 'middle' }}>
              <BsArrowRight />
            </span>{' '}
          </button>
        </form>

        <div className={styles.re__route}>
          <p>
            Already have an account 🖤 <NavLink to={'/login'}>Login</NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default SignupPage
