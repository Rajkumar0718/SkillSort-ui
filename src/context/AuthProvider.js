import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from "react";
import { isRoleValidation } from '../utils/Validation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    let token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
    if (token) {
      let user = localStorage.getItem('user') || "{}";
      const role = isRoleValidation();
      setAuth({ token, user: JSON.parse(user), role });
      setLoading(false); // Set loading to false after setting auth
    } else {
      setLoading(false); // Also set loading to false if no token is found
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
