import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import './assests/css/AdminDashboard.css';
import './assests/css/ReactToast.css';

import Layout from "./common/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import AddStaff from "./components/college/AddStaff";
import CollegeReportList from "./components/college/CollegeReportList";
import StaffList from "./components/college/StaffList";
import StudentList from "./components/college/StudentList";
import CompanyList from "./components/SuperAdmin/CompanyList";
import HomePage from "./components/SuperAdmin/HomePage";
import ThankYouPage from "./components/Candidate/ThankYouPage";
import PublicRegister from "./components/Candidate/PublicRegister";
import CandidateReg from "./components/CandidateReg";
import CandidateInstruction from "./components/Candidate/CandidateInstruction";
import ProjectUi from "./components/project-ui/ProjectUI";
import ReExamRequest from "./components/Candidate/AlreadyWrittenExam";

function App() {
  return (
    <div>
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
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </div>
  )
}

export default App;
