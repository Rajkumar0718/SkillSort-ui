import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const RequireAuth = ({allowedRoles}) => {
   const location = useLocation();
   const { auth } = useAuth();

   return(
     auth?.role && allowedRoles?.includes(auth.role) ? <Outlet/> : <Navigate to="/login" state={{from : location}} replace />
   )
}

RequireAuth.propTypes ={
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default RequireAuth;
