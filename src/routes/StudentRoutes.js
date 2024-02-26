import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import { withLocation } from "../utils/CommonUtils";
import Layout from "../common/Layout";

const SelectTech = React.lazy(() => import("../components/Candidate/SelectTech"));
const TakePicture = React.lazy(() => import("../components/Candidate/TakePicture"));
const AdvertisementPage = React.lazy(() => import("../components/Student/AdvertisementPage"));
const CompanyOffers = React.lazy(() => import("../components/Student/CompanyOffers"));
const PracticeExamList = React.lazy(() => import("../components/Student/PracticeExamList"));
const StudentFirstTimeLogin = React.lazy(() => import("../components/Student/StudentFirstTimeLogin"));
const StudentTestList = React.lazy(() => import("../components/Student/StudentTestList"));
const CompetitorUpdate = React.lazy(() => import("../components/Competitor/CompetitorUpdate"));

const EnhancedCompetitorUpdate = withLocation(CompetitorUpdate);

export default function StudentRoutes() {
  return (
    <Routes>
      <Route path="/student/" element={<Layout />}>
        <Route element={<RequireAuth allowedRoles={["COLLEGE_STUDENT", "COMPETITOR", "DEMO_ROLE"]} />}>
          <Route path="" element={<StudentFirstTimeLogin />} />
          <Route path="profile" element={<StudentFirstTimeLogin />} />
          <Route path="student-test" element={<StudentTestList />} />
          <Route path="company-offer" element={<CompanyOffers />} />
          <Route path="practice-exam" element={<PracticeExamList />} />
          <Route path="advertisement" element={<AdvertisementPage />} />
        </Route>
      </Route>
      <Route path="/competitor/" element={<Layout />}>
        <Route element={<RequireAuth allowedRoles={["COLLEGE_STUDENT", "COMPETITOR", "DEMO_ROLE"]} />}>
          <Route path='testList' element={<StudentTestList />} />
          <Route path='update' element={<EnhancedCompetitorUpdate />} />
          <Route path='company-offer' element={<CompanyOffers />} />
          <Route path='test/takePicture' element={<TakePicture />} />
          <Route path='test/selectTech' element={<SelectTech />} />
        </Route>
      </Route>
    </Routes>
  )
}