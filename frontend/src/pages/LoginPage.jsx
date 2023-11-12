import { NavLink, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import axios from 'axios'

import { useFormik } from 'formik'
import { loginSchema } from '../schemas/login'

import { BsArrowRight } from 'react-icons/bs'

import styles from '../styles/login.module.css'
import { setUser } from '../features/users/userSlice'
import { toast } from 'react-toastify'
import { useState } from 'react'

const initialValues = {
  email: '',
  password: '',
}

const LoginPage = () => {
  const { user } = useSelector((state) => state.user)

  const [log, setLog] = useState(false)
  const dispatch = useDispatch()

  const navigate = useNavigate()

  // formik
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: async (values, action) => {
        const { email, password } = values

        setLog((prevState) => !prevState)

        try {
          const { data } = await axios.post('/api/v1/users/login', {
            email,
            password,
          })

          // dispatch action
          dispatch(setUser(data))
          navigate('/')
        } catch (error) {
          toast.error(error.response.data.error)
        }

        // reset form
        action.resetForm()
      },
    })

  if (user) {
    return <Navigate to={'/'} />
  }

  return (
    <section className={styles.section}>
      <div className={styles.form__container}>
        <h1>Login</h1>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
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

          {/* button */}
          <button
            type='submit'
            style={{ fontSize: '1.5rem', padding: '1.5rem' }}
            disabled={log ? true : false}
          >
            {log ? 'Wait... ' : 'Login '}
            <span style={{ verticalAlign: 'middle' }}>
              <BsArrowRight />
            </span>{' '}
          </button>
        </form>

        <div className={styles.re__route}>
          <p>
            Don&apos;t have an account 🚀{' '}
            <NavLink to={'/signup'}>Register</NavLink>
          </p>
        </div>
      </div>
    </section>
  )
}

export default LoginPage
