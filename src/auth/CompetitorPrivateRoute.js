import React from 'react'
import { Redirect } from 'react-router-dom';
import { isRoleValidation } from '../utils/Validation';

function CompetitorPrivateRoute(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');
    return isAuthenticated && (isRoleValidation().includes('COMPETITOR') || isRoleValidation().includes('DEMO_ROLE')) ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);

}

export default CompetitorPrivateRoute
