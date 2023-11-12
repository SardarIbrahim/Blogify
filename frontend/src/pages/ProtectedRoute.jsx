import { Navigate } from 'react-router-dom'

import { useSelector } from 'react-redux'

const ProtectedRoute = ({ children }) => {
  // check user in store
  const { user } = useSelector((state) => state.user)

  if (!user) {
    return <Navigate to='/login' />
  }

  return children
}

export default ProtectedRoute
