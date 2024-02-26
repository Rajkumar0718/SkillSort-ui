import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/Layout";
import RequireAuth from "../components/RequireAuth";

const AddQuestion = React.lazy(() => import("../components/TestAdmin/AddQuestion"));
const Dashboard = React.lazy(() => import("../components/TestAdmin/Dashboard"));
const GroupTypesList = React.lazy(() => import("../components/TestAdmin/GroupTypesList"));
const Question = React.lazy(() => import("../components/TestAdmin/Question"));
const SectionList = React.lazy(() => import("../components/Admin/SectionList"));
const SettingList = React.lazy(() => import("../components/Admin/SettingList"));

export default function TestAdminRoutes() {
  return (
    <Routes>
      <Route path="/testadmin/" element={<Layout />}>
        <Route element={<RequireAuth allowedRoles={["TEST_ADMIN"]} />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path='section' element={<SectionList />} />
          <Route path='question' element={<Question />} />
          <Route path='question/add' element={<AddQuestion />} />
          <Route path='question/edit' element={<AddQuestion />} />
          <Route path='grouptypes' element={<GroupTypesList />} />
          <Route path='setting' element={<SettingList />} />
        </Route>
      </Route>
    </Routes>
  )
}