// // import React, { useState, Suspense } from 'react';
// // import { Redirect, Route, Routes } from 'react-router-dom';
// // import SuperAdminCompetitorSidebar from '../components/SuperAdmin/SuperAdminCompetitorSidebar';
// // import _ from 'lodash';
// // import '../assests/css/AdminDashboard.css';
// // import ZZ5H from '../assests/images/ZZ5H.gif';
// // import Header from '../common/Header';
// // import CompetitorRoutes from '../utils/Menu/SuperAdminInternalRoutes/CompetitorRoutes';
// // import Breadcrumbs from './SuperAdminBreadcrumbs';
// // import { useNavigate } from "react-router-dom";

// // const SuperAdminReportLayout = () => {
// //     const [showSidenav, setShowSidenav] = useState(false);
    
// //     const Navigate = useNavigate();

// //     const toggleButtonClicked = () => {
// //         setShowSidenav(prevState => !prevState);
// //     };

// //     const logOut = () => {
// //         localStorage.clear();
// //         window.location.reload();
// //         return <Navigate to="/login" />;
// //     };

// //     const crumbsPathWithName = _.reduce(
// //         CompetitorRoutes,
// //         function (map, value) {
// //             map[value.path] = value.name;
// //             return map;
// //         },
// //         {}
// //     );

// //     return (
// //         <>
// //             <SuperAdminCompetitorSidebar showSidenav={showSidenav}></SuperAdminCompetitorSidebar>
// //             <div className="d-flex" id="wrapper">
// //                 <div id="page-content-wrapper">
// //                     <Header onClickToggled={toggleButtonClicked} logOut={logOut} showSidenav={showSidenav}></Header>
// //                     <div style={{ margin: '25px 0px 0px 25px' }}>
// //                         <Breadcrumbs crumbsPathWithName={crumbsPathWithName} />
// //                     </div>
// //                     <div className="container-fluid">
// //                         <Suspense fallback={<div className="animated fadeIn pt-1 text-center"><img src={ZZ5H} alt="SkillSort" /></div>}>
// //                             <Routes>
// //                                 {CompetitorRoutes.map((route, idx) => {
// //                                     return route.path !== undefined ? (
// //                                         <Route
// //                                             key={idx}
// //                                             path={route.path}
// //                                             exact='true'
// //                                             name={route.name}
// //                                             render={props => (
// //                                                 <route.component {...props} />
// //                                             )} />
// //                                     ) :
// //                                         <Navigate to='/404' />;
// //                                 })}
// //                             </Routes>
// //                         </Suspense>
// //                     </div>
// //                 </div>
// //             </div>
// //         </>
// //     );
// // };

// // export default SuperAdminReportLayout;

// import React from 'react'

// function SuperAdminReportLayout() {
//   return (
//     <div>SuperAdminReportLayout</div>
//   )
// }

// export default SuperAdminReportLayout
