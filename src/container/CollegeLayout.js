import React, { useState, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Header from "../common/Header";
import Breadcrumbs from "../common/Breadcrumb";
import ZZ5H from "../assests/images/SVKl-unscreen.gif";
import SideBars from "../common/SideBars";
import PageNotFound from "../components/PageNotFound";
import CollegeReportList from "../components/college/CollegeReportList";
import StaffList from "../components/college/StaffList";
import StudentList from "../components/college/StudentList";
import CustomBreadcrumbs from "../common/CustomBreadcrumbs";

const CollegeLayout = () => {
  const collegeRoutes = [
    { path: "placement-coordinator", component: StaffList },
    { path: "staff", component: StudentList },
    { path: "report", component: CollegeReportList },
  ];

  const sidebarLinks = [
    {
      to: "placement-coordinator",
      iconButton: <AccountCircleIcon></AccountCircleIcon>,
      label: "Placement-coordinator",
    },
    {
      to: "staff",
      iconButton: <GroupsIcon></GroupsIcon>,
      label: "Student",
    },
    {
      to: "report",
      iconButton: <TextSnippetIcon></TextSnippetIcon>,
      label: "SkillSort User Report",
    },
  ];

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
    homeLink: "/college/staff",
    separator: ">",
    linkStyle: { cursor: 'pointer', color: '#3f51b5' },
    activeTypographyStyle: { color: 'grey' },
};
  return (
    <div>
      <SideBars links={sidebarLinks}></SideBars>
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper" style={{ position: "absolute" }}>
          <Header
            onClickToggled={toggleButtonClicked}
            logOut={() => logOut()}
            showSidenav={showSidenav}
          />
          <div style={{ margin: "25px 0px 0px 25px" }}>
            <CustomBreadcrumbs {...breadcrumbsProps}></CustomBreadcrumbs>

          </div>
          <div className="container-fluid">
            <Suspense
              fallback={
                <div
                  className="animated fadeIn pt-1"
                  style={{ position: "fixed", top: "40%", left: "45%" }}
                >
                  <img src={ZZ5H} width={150} height={150} alt="loading"></img>
                </div>
              }
            >
              <Routes>
                  {collegeRoutes.map((route, index) => (
                    route.path !== 'undefined' ?
                    <Route
                      key={index}
                      path={route.path}
                      element={<route.component />}
                    />
                  : <Route path="*" element={<PageNotFound />} />
                  ))}

              </Routes>

            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLayout;
