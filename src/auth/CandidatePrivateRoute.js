import React from 'react'
import PageNotFound from '../components/PageNotFound'
function CandidatePrivateRoute(props) {
    const Component = props.component;
    const isAuthenticated = localStorage.getItem('jwtToken');
    return isAuthenticated ? (<Component />) : (<PageNotFound />);
}

export default CandidatePrivateRoute