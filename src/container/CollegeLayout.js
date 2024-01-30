import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Header from "../common/Header";
import Breadcrumb from "../common/Breadcrumb";
import ZZ5H from "../assests/images/SVKl-unscreen.gif";
import SideBar from "../common/SideBar";
import PageNotFound from "../components/PageNotFound";
import CollegeReportList from "../components/college/CollegeReportList";
import StaffList from "../components/college/StaffList";
import StudentList from "../components/college/StudentList";
import { Suspense, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";


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
      homeLink:"/college/staff"
    },
    {
      to: "staff",
      iconButton: <GroupsIcon></GroupsIcon>,
      label: "Student",
      homeLink:"/college/staff"
    },
    {
      to: "report",
      iconButton: <TextSnippetIcon></TextSnippetIcon>,
      label: "SkillSort User Report",
      homeLink:"/college/staff",
      child: [
        { title: "Child Item 1" },
        { title: "Child Item 2" },
      ],
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
    linkStyle: { cursor: "pointer", color: "#3f51b5" },
    activeTypographyStyle: { color: "grey" },
  };
  return (
    <div>
      <SideBar links={sidebarLinks}></SideBar>
      <div className="d-flex" id="wrapper">
        <div id="page-content-wrapper" style={{ position: "absolute" }}>
          <Header
            onClickToggled={toggleButtonClicked}
            logOut={() => logOut()}
            showSidenav={showSidenav}
          />
          <div style={{ margin: "25px 0px 0px 25px" }}>
            <Breadcrumb></Breadcrumb>
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
                {collegeRoutes.map((route, index) =>
                  route.path !== "undefined" ? (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={<route.component />}
                    />
                  ) : (
                    <Route path="*" element={<PageNotFound />} />
                  )
                )}
              </Routes>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeLayout;