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
import CandidateInterface from "./components/Candidate/CandidateInterface";
import StaffList from "./components/college/StaffList"
import AddStaff from "./components/college/AddStaff"
import CollegeReportList from "./components/college/CollegeReportList"
import PracticeExamList from "./components/Student/PracticeExamList";
import StudentFirstTimeLogin from "./components/Student/StudentFirstTimeLogin";
import StudentTestList from "./components/Student/StudentTestList";
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
import ProgramUI from "./components/Candidate/ProgramUI";
import { withLocation } from "./utils/CommonUtils";
import AdvertisementPage from "./components/Student/AdvertisementPage";
import QueryUi from "./components/Candidate/QueryUi";
import SelectTech from "./components/Candidate/SelectTech";


const EnhancedCandidateInstruction = withLocation(CandidateInstruction);
const EnhancedProgramUI = withLocation(ProgramUI)
const EnhancedQueryUI = withLocation(QueryUi)

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
         <Route path='/login/student' element={<StudentFromWebsite/>} />
         <Route path="/setpassword" component={<StudentFromWebsite/>}/>
         <Route path="/candidateinstruction" element={<EnhancedCandidateInstruction />} />
         <Route path="/student/test/selectTech" element={<SelectTech/>}/>
         <Route path='/test' element={<CandidateInterface />} />
         <Route path='/thankYou' element={<ThankYouPage />} />
         <Route path='/program/:token/:examId/:examUsersId/:collegeId' element={<EnhancedProgramUI />} />
         <Route path='/program/:token/:examId/:examUsersId' element={<EnhancedProgramUI />} />
         <Route path='/program' element={<EnhancedProgramUI />} />
         <Route path='/sql' element={<EnhancedQueryUI />} />
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
          <Route element={<RequireAuth allowedRoles={["COLLEGE_STUDENT"]} />}>
           <Route path="/student" element={<StudentFirstTimeLogin />} />
           <Route path="/student/profile" element={<StudentFirstTimeLogin />} />
           <Route path="/student/student-test" element={<StudentTestList />} />
           <Route path="/student/company-offer" element={<CompanyOffers />} />
           <Route path="/student/student-practice-exam" element={<PracticeExamList />} />
           <Route path="/student/advertisement" element={<AdvertisementPage />} />
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