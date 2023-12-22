import React from 'react';
import { Redirect } from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';

function ProtectedRoute(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated && (isRoleValidation() === 'ADMIN' || isRoleValidation() === 'HR' || isRoleValidation() === 'HR_MANAGER' || isRoleValidation() === 'TRIAL_ADMIN') ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);
}


export default ProtectedRoute;

