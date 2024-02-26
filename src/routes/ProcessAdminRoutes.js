import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/Layout";
import RequireAuth from "../components/RequireAuth";

const CandidateLists = React.lazy(() => import("../components/ProcessAdmin/CandidateList"));
const ExamListProcesss = React.lazy(() => import("../components/Student/StudentTestList"));
const SendMail = React.lazy(() => import("../components/ProcessAdmin/ExamList"));
const CompanyList = React.lazy(() => import("../components/SuperAdmin/CompanyList"));

export default function ProcessAdminRoutes() {
  <Routes>
    <Route path="/processadmin/" element={<Layout />}>
      <Route element={<RequireAuth allowedRoles={["PROCESS_ADMIN"]} />}>
        <Route path="" element={<CompanyList />} />
        <Route path="company" element={<CompanyList />} />
        <Route path="company/test" element={<ExamListProcesss />} />
        <Route path="company/test/candidate" element={<CandidateLists />} />
        <Route path="company/test/candidate/sendmail" element={<SendMail />} />
      </Route>
    </Route>
  </Routes>
}