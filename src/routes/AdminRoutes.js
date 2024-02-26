import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../common/Layout";
import RequireAuth from "../components/RequireAuth";

const AddExam = React.lazy(() => import("../components/Admin/AddExam"));
const AddHr = React.lazy(() => import("../components/Admin/AddHr"));
const CandidateDetailsOnGoingExam = React.lazy(() => import("../components/Admin/CandidateDetailsOnGoingExam"));
const ExamList = React.lazy(() => import("../components/Admin/ExamList"));
const ListHr = React.lazy(() => import("../components/Admin/ListHr"));
const OnGoingExam = React.lazy(() => import("../components/Admin/OnGoingExam"));
const Position = React.lazy(() => import("../components/Admin/Position"));
const PositionDetails = React.lazy(() => import("../components/Admin/PositionDetails"));
const SMTPConfig = React.lazy(() => import("../components/Admin/SMTPConfig"));
const SectionList = React.lazy(() => import("../components/Admin/SectionList"));
const SettingList = React.lazy(() => import("../components/Admin/SettingList"));
const VacancyHistory = React.lazy(() => import("../components/Admin/VacancyHistory"));
const CandidateList = React.lazy(() => import("../components/Admin/CandidateList"));
const AddQuestion = React.lazy(() => import("../components/TestAdmin/AddQuestion"));
const Question = React.lazy(() => import("../components/TestAdmin/Question"));
const Profile = React.lazy(() => import("../components/Admin/Profile"));;

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin/" element={<Layout />}>
        <Route
          element={
            <RequireAuth allowedRoles={["ADMIN", "HR", "HR_MANAGER", "TRIAL_ADMIN"]} />
          }
        >
          <Route path="candidates" element={<CandidateList />} />
          <Route path="vacancy" element={<Position />} />
          <Route path="vacancy/history" element={<VacancyHistory />} />
          <Route path="vacancy/add" element={<PositionDetails />} />
          <Route path="vacancy/edit" element={<PositionDetails />} />
          <Route path="vacancy/skillsort" element={<PositionDetails />} />
          <Route path="vacancy/result" element={<PositionDetails />} />
          <Route path="setting" element={<SettingList />} />
          <Route path="hr" element={<ListHr />} />
          <Route path="hr/add" element={<AddHr />} />
          <Route path="hr/edit" element={<AddHr />} />
          <Route path="onGoingTest" element={<OnGoingExam />} />
          <Route path="onGoingTest/candidate" element={<CandidateDetailsOnGoingExam />} />
          <Route path="test" element={<ExamList />} />
          <Route path='test/add' element={<AddExam />} />
          <Route path='test/edit' element={<AddExam />} />
          <Route path='section' element={<SectionList />} />
          <Route path='questions' element={<Question />} />
          <Route path='questions/add' element={<AddQuestion />} />
          <Route path='questions/edit' element={<AddQuestion />} />
          <Route path="smtp" element={<SMTPConfig />} />
          <Route path="vacancy/Exam-add" element={<AddExam />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  )

}