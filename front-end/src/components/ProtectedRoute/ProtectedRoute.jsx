import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({children}) => {
//   const {accessToken} = useSelector(state => state.auth)

//   if (!accessToken) {
//     return <Navigate to={'/login'} />
//   };
  
//   return children;
// }

const ProtectedRoute = ({ children, requiredRole }) => {
  const { accessToken, user } = useSelector(state => state.auth);

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute
