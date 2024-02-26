import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from '../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { auth, loading } = useAuth(); // Destructure loading state

  if (loading) {
    return null; // Or a loading indicator, depending on your preference
  }

  return (
    auth?.role && allowedRoles?.includes(auth.role) ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />
  );
}

RequireAuth.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default RequireAuth;
