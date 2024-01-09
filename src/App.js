import AdminLogin from "./components/Admin/AdminLogin";
import { Route, Routes, useRoutes } from "react-router-dom";
import HomePage from "./components/SuperAdmin/HomePage";
import PageNotFound from "./components/PageNotFound";
import CollegeList from "./components/SuperAdmin/CollegeList";
import CollegeLayout from "./container/CollegeLayout";
import Layout from "./common/Layout";
import StudentList from "./components/college/StudentList";
import RequireAuth from "./components/RequireAuth";
import StaffList from "./components/college/StaffList";
import AddStaff from "./components/college/AddStaff";
import CollegeReportList from "./components/college/CollegeReportList";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<AdminLogin />}></Route>
        <Route path="/login" element={<AdminLogin />} />
        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN","COLLEGE_STAFF"]}/>}>
          <Route path="/college" element={<StudentList />} />
          <Route path="/college/placement-coordinator" element = {<StaffList/>} />
          <Route path="/college/placement-coordinator/add" element = {<AddStaff />} />
          <Route path="/college/collegeReport" element={<CollegeReportList/>} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  )
}

export default App;
