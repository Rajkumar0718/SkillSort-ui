import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import Layout from "../common/Layout";

const AddStaff = React.lazy(() => import("../components/College/AddStaff"));
const AddStudent = React.lazy(() => import("../components/College/AddStudent"));
const CollegeReportList = React.lazy(() => import("../components/College/CollegeReportList"));
const StaffList = React.lazy(() => import("../components/College/StaffList"));
const StudentList = React.lazy(() => import("../components/College/StudentList"));

export default function CollegeRoutes() {
  return (
    <Routes>
      <Route path="/college/" element={<Layout />}>
        <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]}></RequireAuth>}>
          <Route path="" element={<StudentList />} />
          <Route path="placement-coordinator" element={<StaffList />} />
          <Route path="placement-coordinator/edit" element={<AddStaff />} />
          <Route path="collegeReport" element={<CollegeReportList />} />
          <Route path="add" element={<AddStudent />} />
          <Route path="edit" element={<AddStudent />} />
          <Route path="placement-coordinator/add" element={<AddStaff />} />
        </Route>
      </Route>
    </Routes>
  );
}
