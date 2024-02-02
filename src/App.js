import { Route, Routes } from "react-router-dom";
import './assests/css/AdminDashboard.css';
import Layout from "./common/Layout";
import SuperAdminLayout from "./common/SuperAdminLayout";
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import CollegeList from "./components/SuperAdmin/CollegeList";
import CompanyList from "./components/SuperAdmin/CompanyList";
import CompetitorList from "./components/SuperAdmin/CompetitorList";
import HomePage from "./components/SuperAdmin/HomePage";
import ListIndustryAndTechnologies from "./components/SuperAdmin/ListIndustryAndTechnologies";
import ProcessAdminList from "./components/SuperAdmin/ProcessAdminList";
import RecruiterList from "./components/SuperAdmin/RecruiterList";
import AddStaff from "./components/College/AddStaff";
import AddStudent from "./components/College/AddStudent";
import CollegeReportList from "./components/College/CollegeReportList";
import StaffList from "./components/College/StaffList";
import StudentList from "./components/College/StudentList";
import SuperAdminReportLayout from "./container/SuperAdminReportLayout";
import AddCollege from "./components/SuperAdmin/AddCollege";
import CollegeAdminList from "./components/SuperAdmin/CollegeAdminList";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddCollegeAdmin from "./components/SuperAdmin/AddCollegeAdmin";
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
import SectionWeightage from "./components/SuperAdmin/SectionWeightage";
import SMTPConfig from "./components/Admin/SMTPConfig";
import DepatmentList from "./components/College/DepartmentList";
import PlanMaster from "./components/SuperAdmin/PlanMaster";
import PracticeExam from "./components/SuperAdmin/PracticeExam";
import PracticeExamTest from "./components/SuperAdmin/PracticeExamTest";
import TestList from "./components/SuperAdmin/TestList";
import Test from "./components/SuperAdmin/Test";
import AdvSearch from "./components/Admin/AdvanceSearch";
import Signupcount from "./components/SuperAdmin/Signupcount";



function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route index element={<AdminLogin />}></Route>
        <Route path="/login" element={<AdminLogin />} />

        {/* Private Routes */}
        <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="/" element={<SuperAdminLayout />} >
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
            <Route path="/collegeadmin" element={<CollegeList />} />
            <Route path="/companyadmin" element={<CompanyList />} />
            <Route path="/panelists" element={<RecruiterList />} />
            <Route path="/panelists/payment" element={<Payment />} />
            <Route path="/settings/department" element={<DepatmentList />} />
            <Route path="/settings/practiceExam" element={<PracticeExam />} />
            <Route path="/settings/practiceExam/addPracticeExam" element={<PracticeExamTest/>} />
            <Route path="/settings/practiceExam/viewPracticeExam" element={<PracticeExamTest/>} />
            <Route path="/settings/test" element={<TestList/>} />
            <Route path="/settings/test/addtest" element={<Test/>} />
            <Route path="/settings/test/view" element={<Test/>} />
            <Route path="/settings/plan-master" element={<PlanMaster />} />
            <Route path="/skillsortadmin" element={<ProcessAdminList />} />
            <Route path="/skillsortadmin/edit" element={<AddProcessAdmin />} />
            <Route path="/skillsortadmin/testadmin" element={<TestAdminList />} />
            <Route path="/skillsortadmin/testadmin/add" element={<AddTestAdmin />} />
            <Route path="/skillsortadmin/testadmin/edit" element={<AddTestAdmin />} />
            <Route path="/skillsortadmin/advertisement" element={<AdvertisementHistory />} />
            <Route path="/skillsortadmin/advertisement/add" element={<AddAdvertisement />} />
            <Route path="/skillsortadmin/advertisement/edit" element={<AddAdvertisement />} />
            <Route path="/settings" element={<ListIndustryAndTechnologies />} />
            <Route path="/settings/smtp" element={<SMTPConfig />} />
            <Route path="/settings/weightage" element={<SectionWeightage />} />
            <Route path="/settings/freeCredits" element={<FreeCredits />} />
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
            <Route path="/report/advance-search" element={<AdvSearch />}/>
            <Route path="/report/activity-dashboard" element={<Signupcount/>} /> 
            
          </Route>
        </Route>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />} >
            <Route path="/college" element={<StudentList />} />
            <Route
              path="/college/placement-coordinator"
              element={<StaffList />}
            />
            <Route
              path="/college/placement-coordinator/add"
              element={<AddStaff />}
            />
            <Route
              path="/college/collegeReport"
              element={<CollegeReportList />}
            />
            <Route path="/college/add" element={<AddStudent />} />
          </Route>
          <Route path="/report" element={<SuperAdminReportLayout />} />
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
            {/* <Route path="/report/advance-search" element={<AdvSearchSupAdmin />} />
          <Route path="/report" element={<CompetitorList />} />
          <Route path="/individualUser/details" element={<CompetitorDetails />} />
          <Route path="/individualUser/add/skills" element={<AddSkills />} />
          <Route path="/individualUser/skills" element={<SkillList />} />
          <Route path="/individualUser/question/edit" element={<AddQuestion />} />
          <Route path="/individualUser/question" element={<QuestionList />} />
          <Route path="/collegeadmin" element={<CollegeList />} />
          <Route path="/companyadmin" element={<CompanyList />} />
          <Route path="/panelists" element={<RecruiterList />} />
          <Route path="/skillsortadmin" element={<ProcessAdminList />} />
          <Route path="/settings" element={<ListIndustryAndTechnologies />} />
          <Route path="/report/activity-dashboard" element={<Signupcount />} /> */}
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </>
  );
}

export default App;


