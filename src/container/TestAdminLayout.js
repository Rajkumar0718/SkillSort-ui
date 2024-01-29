import React, { Suspense ,useState ,useHistory} from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/TestAdmin/Sidebar';
import '../assests/css/AdminDashboard.css';
import ZZ5H from '../assests/images/ZZ5H.gif';
import Header from '../common/Header';
import TestAdminRoutes from "../utils/TestAdminRoutes";
import Breadcrumbs from './TestAdminBreadcrumbs';

const TestAdminLayout = () => {

    const [showSidenav, setShowSidenav] = useState(false);
    const history = useHistory();
    const toggleButtonClicked = () => {
      setShowSidenav(!showSidenav);
    };
  
    const logOut = () => {
      localStorage.clear();
      history.push('/login');
      window.location.reload();
    };
  return (
    <>
        <Sidebar showSidenav={showSidenav}></Sidebar>
        <div className="d-flex" id="wrapper">
          <div id="page-content-wrapper" style={{ position: 'absolute' }}>
            <Header onClickToggled={toggleButtonClicked} logOut={() =>logOut()} showSidenav={showSidenav}></Header>
            <div style={{ margin: "25px 0px 0px 25px" }}>
              <Breadcrumbs />
            </div>
            <div className="container-fluid">
              <Suspense fallback={<div className="animated fadeIn pt-1 text-center"><img src={ZZ5H} alt="SkillSort" /></div>}>
                <Routes>
                  {TestAdminRoutes.map((route, idx) => {
                    return route.path !== undefined ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact='true'
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : <Navigate to='/404' />;
                  })}
                </Routes>
              </Suspense>
            </div>
          </div>
        </div>
      </>
  )
}

export default TestAdminLayout