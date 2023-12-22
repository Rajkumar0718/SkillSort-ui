import React from 'react';
import { Redirect } from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';

function StudentPrivateRoute(props) {

    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');

    return isAuthenticated && (isRoleValidation().includes('COLLEGE_STUDENT')) ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);

}

export default StudentPrivateRoute;