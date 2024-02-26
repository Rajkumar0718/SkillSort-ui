import PropTypes from 'prop-types';
import { createContext, useEffect, useState } from "react";
import { isRoleValidation } from '../utils/Validation';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  useEffect(() => {
    let token = localStorage.getItem('token') || localStorage.getItem('jwtToken') 
      if(token) {
          let user = localStorage.getItem('user') || "{}";
          const role = isRoleValidation()
          setAuth({token,user: JSON.parse(user), role})
      }
  },[])
  
  return (
    <AuthContext.Provider value={{auth, setAuth}}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
