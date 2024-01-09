import React from 'react';
import { Redirect } from 'react-router-dom';

function ProcessAdminPrivateRoutes(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('token');

    if (isAuthenticated) {
        let token = isAuthenticated.split(".")[1];
        let base64 = token.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        var payload = JSON.parse(jsonPayload)
    }

    return isAuthenticated && payload.role === 'PROCESS_ADMIN' ? (<Component />) : (<Redirect to={{ pathname: '/login' }} />);
};

export default ProcessAdminPrivateRoutes;
