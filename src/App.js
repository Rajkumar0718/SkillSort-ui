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
import AddStudent from "./components/College/AddStudent";
import CollegeReportList from "./components/College/CollegeReportList";
import AddCollege from "./components/SuperAdmin/AddCollege";
import CollegeAdminList from "./components/SuperAdmin/CollegeAdminList";
import { ToastContainer} from 'react-toastify';
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
import DepatmentList from "./components/College/DepartmentList";
import PlanMaster from "./components/SuperAdmin/PlanMaster";
import PracticeExam from "./components/SuperAdmin/PracticeExam";
import PracticeExamTest from "./components/SuperAdmin/PracticeExamTest";
import TestList from "./components/SuperAdmin/TestList";
import Test from "./components/SuperAdmin/Test";
import AdvSearch from "./components/Admin/AdvanceSearch";
import Signupcount from "./components/SuperAdmin/Signupcount";
import Position from "./components/Admin/Position";
import VacancyHistory from "./components/Admin/VacancyHistory";
import PositionDetails from "./components/Admin/PositionDetails";
import SettingList from "./components/Admin/SettingList";
import ListHr from "./components/Admin/ListHr";
import AddHr from "./components/Admin/AddHr";
import OnGoingExam from "./components/Admin/OnGoingExam";
import CandidateDetailsOnGoingExam from "./components/Admin/CandidateDetailsOnGoingExam";
import ExamList from "./components/Admin/ExamList";

import ExamListProcess from "./components/ProcessAdmin/ExamList";

import AddExam from "./components/Admin/AddExam";
import SectionList from "./components/Admin/SectionList";
import AddQuestion from "./components/TestAdmin/AddQuestion";
import Question from "./components/TestAdmin/Question";
import Dashboard from "./components/TestAdmin/Dashboard"
import GroupTypesList from "./components/TestAdmin/GroupTypesList"
import ProgramResult from "./components/Admin/ProgramResult";
import SMTPConfig from "./components/Admin/SMTPConfig";
import CandidateResultDetails from "./components/Admin/CandidateResultDetails";
import ShortListedResultDetails from "./components/Admin/ShortListedResultDetails"
import CandidateList from "./components/ProcessAdmin/CandidateList";
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
            <Route path="/settings/practiceExam/addPracticeExam" element={<PracticeExamTest />} />
            <Route path="/settings/practiceExam/viewPracticeExam" element={<PracticeExamTest />} />
            <Route path="/settings/test" element={<TestList />} />
            <Route path="/settings/test/addtest" element={<Test />} />
            <Route path="/settings/test/view" element={<Test />} />
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
            <Route path="/report/advance-search" element={<AdvSearch />} />
            <Route path="/report/activity-dashboard" element={<Signupcount />} />
          </Route>
        </Route>
        <Route path="/" element={<Layout />}>
          <Route
            element={
              <RequireAuth allowedRoles={["ADMIN"]} />
            }
          >
            <Route path="/admin/vacancy" element={<Position />} />
            <Route path="/admin/vacancy/history" element={<VacancyHistory />} />
            <Route path="/admin/vacancy/add" element={<PositionDetails />} />
            <Route path="/admin/vacancy/edit" element={<PositionDetails />} />
            <Route path="/admin/vacancy/skillsort" element={<PositionDetails />} />
            <Route path="/admin/vacancy/result" element={<PositionDetails />} />
            <Route path="/admin/setting" element={<SettingList />} />
            <Route path="/admin/hr" element={<ListHr />} />
            <Route path="/admin/hr/add" element={<AddHr />} />
            <Route path="/admin/hr/edit" element={<AddHr />} />
            <Route path="/admin/onGoingTest" element={<OnGoingExam />} />
            <Route path="/admin/onGoingTest/candidate" element={<CandidateDetailsOnGoingExam />} />
            <Route path="/admin/test" element={<ExamList />} />
            <Route path='/admin/test/add' element={<AddExam />} />
            <Route path='/admin/test/edit' element={<AddExam />} />
            <Route path='/admin/section' element={<SectionList />} />
            <Route path='/admin/questions' element={<Question />} />
            <Route path='/admin/questions/add' element={<AddQuestion />} />
            <Route path='/admin/questions/edit' element={<AddQuestion />} />
            <Route path="/admin/smtp" element={<SMTPConfig />} />
            <Route path="admin/vacancy/Exam-add" element={<AddExam />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/college/collegeReport"
            element={<CollegeReportList />}
          />
          <Route path="/college/add" element={<AddStudent />} />
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
          <Route element={<RequireAuth allowedRoles={["PROCESS_ADMIN"]} />}>
            <Route path="/processadmin/company/test" element={<ExamListProcess
             />} />
            <Route path="/processadmin/company" element={<CompanyList />} />
            <Route path="/processadmin" element={<CompanyList />} />


            <Route path="/processadmin/company/test/candidate" element={<CandidateList />} />

    
          </Route>
        </Route>
      </Routes>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </>
  );

}




export default App;


