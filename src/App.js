import { Route, Routes } from "react-router-dom";
import './assests/css/AdminDashboard.css';
import './assests/css/SuperAdminDashboard.css';
import Layout from "./common/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import StudentFromWebsite from "./components/Admin/StudentFromWebsite";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import CompanyOffers from "./components/Student/CompanyOffers";
import PracticeExamList from "./components/Student/PracticeExamList";
import StudentFirstTimeLogin from "./components/Student/StudentFirstTimeLogin";
import StudentTestList from "./components/Student/StudentTestList";
import AddStaff from "./components/college/AddStaff";
import CollegeReportList from "./components/college/CollegeReportList";
import StaffList from "./components/college/StaffList";
import StudentList from "./components/college/StudentList";
import CandidateInstruction from "./components/Candidate/CandidateInstruction";
import CandidateInterface from "./components/Candidate/CandidateInterface";
import ThankYouPage from "./components/Candidate/ThankYouPage";
import ProgramUI from "./components/Candidate/ProgramUI";
import { withLocation } from "./utils/CommonUtils";
import AdvertisementPage from "./components/Student/AdvertisementPage";
import QueryUi from "./components/Candidate/QueryUi";
import { ToastContainer } from "react-toastify";
import SelectTech from "./components/Candidate/SelectTech";

const EnhancedCandidateInstruction = withLocation(CandidateInstruction);
const EnhancedProgramUI = withLocation(ProgramUI)
const EnhancedQueryUI = withLocation(QueryUi)
function App() {
  return (
    <div>
    <Routes>
      {/* Public Routes */}
      <Route index element={<AdminLogin />}></Route>
      {/* Public Routes */}
      <Route path="/login" element={<AdminLogin />} />
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
      <Route path="/" element={<Layout />}>
        {/* Protected Routes */}
        <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />}>
          <Route path="/college" element={<StudentList />} />
          <Route path="/college/placement-coordinator" element={<StaffList />} />
          <Route path="/college/placement-coordinator/add" element={<AddStaff />} />
          <Route path="/college/collegeReport" element={<CollegeReportList />} />
        </Route>
        <Route element={<RequireAuth allowedRoles={["PROCESS_ADMIN"]} />}>
         
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
    <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
          autoClose={1700} />
    </div>
  );
}

export default App;
