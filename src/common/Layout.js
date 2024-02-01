import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ZZ5H from "../assests/images/SVKl-unscreen.gif";
import Breadcrumbs from "./Breadcrumb";
import Header from "./Header";
import TestingSidebar from "./TestingSideBar";

export const Layout = () => {
  const [showSidenav, setShowSidenav] = useState(false);
  const navigate = useNavigate();

  const toggleButtonClicked = () => {
    setShowSidenav(!showSidenav);
  };

  const logOut = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  const breadcrumbsProps = {
    homeLink: "/college",
    name: "college",
  };

  return (
    <div>
      {/* <SideBars links={sidebarLinks}></SideBars> */}
      <TestingSidebar />
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper" style={{ position: "absolute" }}>
          <Header
            onClickToggled={toggleButtonClicked}
            logOut={() => logOut()}
            showSidenav={showSidenav}
          />
          <div style={{ margin: "15px 0px 0px 3px" }}>
            <Breadcrumbs />
            <div className="container-fluid">
              <Suspense
                fallback={
                  <div
                    className="animated fadeIn pt-1"
                    style={{ position: "fixed", top: "40%", left: "45%" }}
                  >
                    <img
                      src={ZZ5H}
                      width={150}
                      height={150}
                      alt="loading"
                    ></img>
                  </div>
                }
              >
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;