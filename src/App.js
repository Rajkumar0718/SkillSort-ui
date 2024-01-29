import { lazy, Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SuperAdminLayout from "./common/SuperAdminLayout";
import './assests/css/AdminDashboard.css';
import './assests/css/ReactToast.css';
import Layout from './common/Layout';
import SuperAdminReportLayout from "./container/SuperAdminReportLayout";
import AddCollege from "./components/SuperAdmin/AddCollege";
import CollegeAdminList from "./components/SuperAdmin/CollegeAdminList";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCollegeAdmin from "./components/SuperAdmin/AddCollegeAdmin";
import AddPlan from "./components/SuperAdmin/AddPlan";
import CompanyPlans from "./components/SuperAdmin/CompanyPlans";
import AddCompany from "./components/SuperAdmin/AddCompany";
import AdminList from "./components/SuperAdmin/AdminList";
import AddAdmin from "./components/SuperAdmin/AddAdmin";
import AddProcessAdmin from "./components/SuperAdmin/AddProcessAdmin";
import TestAdminList from "./components/SuperAdmin/TestAdminList";
import AddTestAdmin from "./components/SuperAdmin/AddTestAdmin";
import AddAdvertisement from "./components/SuperAdmin/AddAdvertisement";
import AdvertisementHistory from "./components/SuperAdmin/AdvertisementHistory";
import Payment from "./components/SuperAdmin/Payment";
import FreeCredits from "./components/SuperAdmin/FreeCredits";
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
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="/" element={<SuperAdminLayout />} >
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
            <Route path="/collegeadmin" element={<CollegeList />} />
            <Route path="/companyadmin" element={<CompanyList />} />
            <Route path="/panelists" element={<RecruiterList />} />
            <Route path="/panelists/payment" element={<Payment />} />
            <Route path="/settings/freeCredits" element={<FreeCredits />} />
            <Route path="/skillsortadmin" element={<ProcessAdminList />} />
            <Route path="/skillsortadmin/edit" element={<AddProcessAdmin />} />
            <Route path="/skillsortadmin/testadmin" element={<TestAdminList />} />
            <Route path="/skillsortadmin/testadmin/add" element={<AddTestAdmin/>} />
            <Route path="/skillsortadmin/testadmin/edit" element={<AddTestAdmin/>} />
            <Route path="/skillsortadmin/advertisement" element={<AdvertisementHistory/>} />
            <Route path="/skillsortadmin/advertisement/add" element={<AddAdvertisement/>} />
            <Route path="/settings" element={<ListIndustryAndTechnologies />} />
            <Route path="/report" element={<CompetitorList />} />
            <Route caseSensitive path="/collegeadmin/add" name="Add" element={<AddCollege />} />
            <Route path="/collegeadmin/edit" name="edit" element={<AddCollege />} />
            <Route caseSensitive path="/collegeadmin/admin" element={<CollegeAdminList />} />
            <Route path="/collegeadmin/admin/add" name="add" element={<AddCollegeAdmin />} />
            <Route path="/collegeadmin/admin/edit" name="edit" element={<AddCollegeAdmin />} />
            <Route path="/companyadmin/plan" element={<CompanyPlans />} />
            <Route path="/companyadmin/add" name="add" element={<AddCompany />} />
            <Route path="/companyadmin/edit" name="edit" element={<AddCompany />} />
            <Route path='/companyadmin/admin' name="Company Admins" element={<AdminList />} />
            <Route path='/companyadmin/admin/add' name="Add" element={<AddAdmin />} />
            <Route path='/companyadmin/admin/edit' name="edit" element={<AddAdmin />} />
            <Route path="/skillsortadmin/add" element={<AddProcessAdmin />} />
          </Route>
        </Route>
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
      </Suspense>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </>
  );

}




export default App;


