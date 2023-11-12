import { NavLink, useRouteError } from 'react-router-dom'

import styles from '../styles/error.module.css'

const ErrorPage = () => {
  const error = useRouteError()

  return (
    <div className={styles.flex__container}>
      <div className={styles.text__center}>
        <h1>404</h1>
        <h3>{error ? error.message : 'PAGE NOT FOUND'}</h3>
        <button type='button' name='button'>
          <NavLink to={'/'}>Return To Home</NavLink>
        </button>
      </div>
    </div>
  )
}

export default ErrorPage
