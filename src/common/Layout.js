import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { isRoleValidation } from "../utils/Validation";
import Breadcrumbs from "./Breadcrumb";
import Header from "./Header";
import TestingSidebar from "./TestingSideBar";

export const Layout = () => {
  const [showSidenav, setShowSidenav] = useState(false);
  const navigate = useNavigate();
  const role = useMemo(() => isRoleValidation())
  const dontShowBreadCrumbs = ["COLLEGE_STUDENT","COMPETITOR","DEMO_ROLE"]

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
  const profilePath = {"COLLEGE_STUDENT":"/student/profile","ADMIN":"/admin/profile", "COMPETITOR":"/competitor/update"}

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
            profile={profilePath[role]}
          />
          <div style={{ margin: "25px 0px 0px 25px" }}>
            {dontShowBreadCrumbs.includes(role) ? <></> : <Breadcrumbs />}
            <div className="container-fluid">
                <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
