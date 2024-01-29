import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './assests/css/AdminDashboard.css';
import './assests/css/ReactToast.css';
import Layout from './common/Layout';

const AdminLogin = lazy(() => import("./components/Admin/AdminLogin"));
const PageNotFound = lazy(() => import("./components/PageNotFound"));
const RequireAuth = lazy(() => import("./components/RequireAuth"));
const AddStaff = lazy(() => import("./components/college/AddStaff"));
const CollegeReportList = lazy(() => import("./components/college/CollegeReportList"));
const StaffList = lazy(() => import("./components/college/StaffList"));
const StudentList = lazy(() => import("./components/college/StudentList"));
const CompanyList = lazy(() => import("./components/SuperAdmin/CompanyList"));
const HomePage = lazy(() => import("./components/SuperAdmin/HomePage"));
const ThankYouPage = lazy(() => import("./components/Candidate/ThankYouPage"));
const PublicRegister = lazy(() => import("./components/Candidate/PublicRegister"));
const CandidateReg = lazy(() => import("./components/CandidateReg"));
const CandidateInstruction = lazy(() => import("./components/Candidate/CandidateInstruction"));
const ProjectUi = lazy(() => import("./components/project-ui/ProjectUI"));
const ReExamRequest = lazy(() => import("./components/Candidate/AlreadyWrittenExam"));
import SectionList from "./components/TestAdmin/SectionList"
import Dashboard from "./components/TestAdmin/Dashboard"
import Question from "./components/TestAdmin/Question"
import AddQuestion from "./components/TestAdmin/AddQuestion"
import GroupTypesList from "./components/TestAdmin/GroupTypesList"
import SettingList from "./components/Admin/SettingList"

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
              <Route path="/college/student" element={<StudentList />} />
              <Route path="/college/placement-coordinator" element={<StaffList />} />
              <Route path="/college/placement-coordinator/add" element={<AddStaff />} />
              <Route path="/college/collegeReport" element={<CollegeReportList />} />
            </Route>
            <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "COLLEGE_STAFF"]} />}>
              <Route path="/companyadmin" element={<CompanyList />} />
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
// { path: '/testadmin/dashboard', name: 'Dashboard', component: Dashboard },
// { path: '/testadmin/section', name: 'Sections', component: SectionList },
// { path: '/testadmin/question', name: 'Questions', component: QuestionList },
// { path: '/testadmin/question/add', name: 'Add Question', component: AddQuestion },
// { path: '/testadmin/question/edit', name: 'Edit Question', component: AddQuestion },
// { path: '/testadmin', name: "Test List", component: QuestionList },
// { path: '/testadmin/add', name: 'Add Test', component: AddExam },
// { path: '/testadmin/edit', name: 'Edit Test', component: AddExam },
// { path: '/testadmin/setting', name: 'Setting List', component: SettingList },
// { path: "/testadmin/smtp", name: 'SMTP', component: SMTPConfig },
// { component: PageNotFound }