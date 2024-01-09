import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isRoleValidation } from "../utils/Validation";

const RequireAuth = ({allowedRoles}) => {
   const location = useLocation();
   const role = isRoleValidation();

   return(
    allowedRoles?.includes(role) ? <Outlet/> : <Navigate to="/login" state={{from : location}} replace /> 
   )
}

RequireAuth.propTypes ={
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default RequireAuth;