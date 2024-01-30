import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './assests/css/AdminDashboard.css';
import './assests/css/ReactToast.css';
import SectionList from "./components/TestAdmin/SectionList"
import Dashboard from "./components/TestAdmin/Dashboard"
import Question from "./components/TestAdmin/Question"
import AddQuestion from "./components/TestAdmin/AddQuestion"
import GroupTypesList from "./components/TestAdmin/GroupTypesList"
import SettingList from "./components/Admin/SettingList"
import Layout from './common/Layout';
import AddStudent from "./components/college/AddStudent"
import StudentList from "./components/college/StudentList"
import StaffList from "./components/college/StaffList"
import AddStaff from "./components/college/AddStaff"
import CollegeReportList from "./components/college/CollegeReportList"

const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const HomePage = lazy(() => import("./components/SuperAdmin/HomePage"));
const ThankYouPage = lazy(() => import("./components/Candidate/ThankYouPage"));
const PublicRegister = lazy(() => import("./components/Candidate/PublicRegister"));
const CandidateReg = lazy(() => import("./components/CandidateReg"));
const CandidateInstruction = lazy(() => import("./components/Candidate/CandidateInstruction"));
const ProjectUi = lazy(() => import("./components/project-ui/ProjectUI"));
const ReExamRequest = lazy(() => import("./components/Candidate/AlreadyWrittenExam"));

function App() {
  return (
    <div>
      <Suspense fallback="Loading...">
        <Routes>
          <Route index element={<AdminLogin />}></Route>
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<RequireAuth allowedRoles={["ROLE_CANDIDATE"]} />}>
            <Route path="/project" element={<ProjectUi />} />
          </Route>
          <Route path="/thankYou" element={<ThankYouPage />} />
          <Route path="/candidateinstruction" element={<CandidateInstruction />} />
          <Route path="/candidate/register/:companyId/:examId" element={<PublicRegister />} />
          <Route path="/public-candidate/register/:companyId/:examId" element={<CandidateReg />} />
          <Route path="/candidate/re-exam-request" element={<ReExamRequest />} />

          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            {/* Protected Routes */}
            <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />}>
              <Route path="/college" element={<StudentList />} />
              <Route path="/college/edit" element={<AddStudent />} />
              <Route path="/college/add" element={<AddStudent />} />
              <Route path="/college/placement-coordinator" element={<StaffList />} />
              <Route path="/college/placement-coordinator/add" element={<AddStaff />} />
              <Route path="/college/placement-coordinator/edit" element={<AddStaff />} />
              <Route path="/college/collegeReport" element={<CollegeReportList />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "COLLEGE_STAFF"]} />}>
              {/* <Route path="/companyadmin" element={<CompanyList />} /> */}
              <Route path="/home" element={<HomePage />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["TEST_ADMIN"]} />}>
              <Route path="/testadmin/dashboard" element={<Dashboard />} />
              <Route path="/testadmin/dashboard" element={<Dashboard />} />
              <Route path='/testadmin/section' element={<SectionList />} />
              <Route path='/testadmin/question' element={<Question />} />
              <Route path='/testadmin/question/add' element={<AddQuestion />} />
              <Route path='/testadmin/question/edit' element={<AddQuestion />} />
              <Route path='/testadmin/grouptypes' element={<GroupTypesList />} />
              <Route path='/testadmin/setting' element={<SettingList />} />
            </Route>
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </div>
  )
}

export default App;