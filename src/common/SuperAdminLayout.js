import { Suspense, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ZZ5H from "../assests/images/SVKl-unscreen.gif";
import breadcrumb from "./BreadcrumbJson";
import Header from "./Header";
import SuperAdminSideBar from "./SuperAdminSideBar";
import SuperAdminBreadcrumbs from "./SuperAdminBreadCrumbs";

export const SuperAdminLayout = () => {
  const [showSidenav, setShowSidenav] = useState(false);
  const navigate = useNavigate();
  let breadCrumbJSON = {}
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


  const pathname = window.location.pathname;
  if (pathname.includes('/collegeadmin')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_COLLEGE'];
  } else if (pathname.includes('/companyadmin')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_COMPANY'];
  } else if (pathname.includes('/panelists')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_PANELISTS'];
  } else if (pathname.includes('/report')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_REPORT'];
  } else if (pathname.includes('/skillsortadmin')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_SKILL_SORT_ADMIN'];
  } else if (pathname.includes('/settings')) {
    breadCrumbJSON = breadcrumb['SUPER_ADMIN_SETTINGS'];
  }


  return (
    <div>
      {/* <SideBars links={sidebarLinks}></SideBars> */}
      <SuperAdminSideBar />
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper" style={{ position: "absolute" }}>
          <Header
            onClickToggled={toggleButtonClicked}
            logOut={() => logOut()}
            showSidenav={showSidenav}
          />
          <div style={{ margin: "25px 0px 0px 25px" }}>
            <SuperAdminBreadcrumbs breadCrumbJSON={breadCrumbJSON}/>
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

export default SuperAdminLayout;
