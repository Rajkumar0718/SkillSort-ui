import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { isRoleValidation } from "../utils/Validation";

const RequireAuth = ({allowedRoles}) => {
   const location = useLocation();
   const role = isRoleValidation();
   const { auth } = useAuth();

   return(
    allowedRoles?.includes(role) && auth?.role? <Outlet/> : <Navigate to="/login" state={{from : location}} replace />
   )
}

RequireAuth.propTypes ={
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default RequireAuth;
