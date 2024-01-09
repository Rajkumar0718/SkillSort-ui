import React from 'react';
import { Redirect } from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';

function TestAdminPrivateRoutes(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated && (isRoleValidation() === 'TEST_ADMIN') ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);

}

export default TestAdminPrivateRoutes;