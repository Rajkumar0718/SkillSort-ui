import React from 'react';
import { Redirect } from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';
function CollegePrivateRoutes(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated && (isRoleValidation() === 'COLLEGE_ADMIN' || isRoleValidation() === 'COLLEGE_STAFF') ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);

}
export default CollegePrivateRoutes


