import React from 'react';
import { Navigate} from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';

function TestAdminPrivateRoutes(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated && (isRoleValidation() === 'TEST_ADMIN') ? (<Component />) : (<Navigate to={{ pathname: '/login' }} />);

}

export default TestAdminPrivateRoutes;