import React from "react";
import { Route, Routes } from "react-router-dom";
import SharedCandidateDetails from "../components/Admin/SharedCandidateDetails";
import TestResults from "../components/SuperAdmin/TestResults";
import { withLocation } from "../utils/CommonUtils";

import ForgetPassword from "../components/Admin/ForgotPassword";
import WronganswerPreview from "../components/Student/WrongAnswerPreview";
import ProjectResultView from "../components/project-ui/ProjectResultView";
import LoginRegistration from "../utils/LoginRegistration";
import CompanyRegister from "../components/Admin/CompanyRegister";

const AdminLogin = React.lazy(() => import("../components/Admin/AdminLogin"));
const CandidateResultDetails = React.lazy(() => import("../components/Admin/CandidateResultDetails"));
const ProgramUI = React.lazy(() => import("../components/Candidate/ProgramUI"));
const ProgramResult = React.lazy(() => import("../components/Admin/ProgramResult"));
const ShortListedResultDetails = React.lazy(() => import("../components/Admin/ShortListedResultDetails"));
const StudentFromWebsite = React.lazy(() => import("../components/Admin/StudentFromWebsite"));
const ReExamRequest = React.lazy(() => import("../components/Candidate/AlreadyWrittenExam"));
const CandidateInstruction = React.lazy(() => import("../components/Candidate/CandidateInstructions"));
const CandidateInterface = React.lazy(() => import("../components/Candidate/CandidateInterface"));
const PublicRegister = React.lazy(() => import("../components/Candidate/PublicRegister"));
const QueryUi = React.lazy(() => import("../components/Candidate/QueryUi"));
const SelectTech = React.lazy(() => import("../components/Candidate/SelectTech"));
const ThankYouPage = React.lazy(() => import("../components/Candidate/ThankYouPage"));
const CandidateReg = React.lazy(() => import("../components/CandidateReg"));
const CompetitorFirstTimeLogin = React.lazy(() => import("../components/Competitor/CompetitorFirstTimeLogin"));
const ProjectUi = React.lazy(() => import("../components/project-ui/ProjectUI"));
const CandidateRegister = React.lazy(() => import("../components/Candidate/CandidateRegister"));

const EnhancedCandidateInstruction = withLocation(CandidateInstruction);
const EnhancedProgramUI = withLocation(ProgramUI)
const EnhancedQueryUI = withLocation(QueryUi)
const EnhancedCandidateRegister = withLocation(CandidateRegister)

function PublicRoutes() {
  return (
    <Routes>
      <Route index path="/" element={<AdminLogin />} />
      <Route exact path="/login" element={<AdminLogin />} />
      <Route exact path='/admin/forgot/password' element={<ForgetPassword />} />
      <Route path='/company/register' element={<CompanyRegister/>} />
      <Route exact path='/register/:token/:examId/:examUsersId' element={<EnhancedCandidateRegister />} />
      <Route exact path='/examResult/:candidateId' element={<TestResults />} />
      <Route exact path="/project" element={<ProjectUi />} />
      <Route exact path='/competitor/login' element={<CompetitorFirstTimeLogin />} />
      <Route exact path='/login/student' element={<StudentFromWebsite />} />
      <Route exact path="/setpassword" component={<StudentFromWebsite />} />
      <Route exact path="/candidateinstruction" element={<EnhancedCandidateInstruction />} />
      <Route exact path="/student/test/selectTech" element={<SelectTech />} />
      <Route exact path='/test' element={<CandidateInterface />} />
      <Route exact path='/thankYou' element={<ThankYouPage />} />
      <Route exact path='/program/:token/:examId/:examUsersId/:collegeId' element={<EnhancedProgramUI />} />
      <Route exact path='/program/:token/:examId/:examUsersId' element={<EnhancedProgramUI />} />
      <Route exact path='/program' element={<EnhancedProgramUI />} />
      <Route exact path='/sql' element={<EnhancedQueryUI />} />
      <Route exact path="/student/wrong-answers/preview" element={<WronganswerPreview />} />
      <Route exact path="/candidate/register/:companyId/:examId" element={<PublicRegister />} />
      <Route exact path="/public-candidate/register/:companyId/:examId" element={<CandidateReg />} />
      <Route exact path="/candidate/re-exam-request" element={<ReExamRequest />} />
      <Route exact path="/shortlisted-candidate-details/:candidateId" element={<ShortListedResultDetails />} />
      <Route exact path="/admin/result/candidate/details/:candidate_id" element={<CandidateResultDetails />} />
      <Route exact path="/admin/result/candidate/programResult/:candidate_id" element={<ProgramResult />} />
      <Route exact path='/candidate-details/:examResultId' element={<SharedCandidateDetails />} />
      <Route exact path="/project-result/:resultId" element={<ProjectResultView />} />
      <Route exact path='/set/password/:token/:id/:role' element={<LoginRegistration />} />
    </Routes>
  )
}

export default PublicRoutes;
