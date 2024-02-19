import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { withLocation } from "./utils/CommonUtils";
import TestResults from "./components/SuperAdmin/TestResults"
import { CircleLoader } from "react-spinners";
import 'react-toastify/dist/ReactToastify.css';
import './assests/css/AdminDashboard.css';
import Layout from "./common/Layout";
import SuperAdminLayout from "./common/SuperAdminLayout";
import CandidateList from "./components/Admin/CandidateList";
import SharedCandidateDetails from "./components/Admin/SharedCandidateDetails";
import Profile from "./components/Admin/Profile";

import CandidateLists from "./components/ProcessAdmin/CandidateList";
import ExamListProcesss from "./components/ProcessAdmin/ExamList";
import SendMail from "./components/ProcessAdmin/SendMail";
import VerifyRecruiter from "./components/SuperAdmin/VerifyRecruiter";
import RecruiterTimeSlot from "./components/SuperAdmin/RecruiterTimeSlot";
import ProjectResultView from "./components/project-ui/ProjectResultView";
import ForgetPassword from "./components/Admin/ForgotPassword";
import WronganswerPreview from "./components/Student/WrongAnswerPreview";
import LoginRegistration from "./utils/LoginRegistration";

const AddExam = React.lazy(() => import("./components/Admin/AddExam"));
const AddHr = React.lazy(() => import("./components/Admin/AddHr"));
const AdminLogin = React.lazy(() => import("./components/Admin/AdminLogin"));
const AdvSearch = React.lazy(() => import("./components/Admin/AdvanceSearch"));
const CandidateDetailsOnGoingExam = React.lazy(() => import("./components/Admin/CandidateDetailsOnGoingExam"));
const CandidateResultDetails = React.lazy(() => import("./components/Admin/CandidateResultDetails"));
const ProgramUI = React.lazy(() => import("./components/Candidate/ProgramUI"));
const ExamList = React.lazy(() => import("./components/Admin/ExamList"));
const ListHr = React.lazy(() => import("./components/Admin/ListHr"));
const OnGoingExam = React.lazy(() => import("./components/Admin/OnGoingExam"));
const Position = React.lazy(() => import("./components/Admin/Position"));
const PositionDetails = React.lazy(() => import("./components/Admin/PositionDetails"));
const ProgramResult = React.lazy(() => import("./components/Admin/ProgramResult"));
const SMTPConfig = React.lazy(() => import("./components/Admin/SMTPConfig"));
const SectionList = React.lazy(() => import("./components/Admin/SectionList"));
const SettingList = React.lazy(() => import("./components/Admin/SettingList"));
const ShortListedResultDetails = React.lazy(() => import("./components/Admin/ShortListedResultDetails"));
const StudentFromWebsite = React.lazy(() => import("./components/Admin/StudentFromWebsite"));
const VacancyHistory = React.lazy(() => import("./components/Admin/VacancyHistory"));
const ReExamRequest = React.lazy(() => import("./components/Candidate/AlreadyWrittenExam"));
const CandidateInstruction = React.lazy(() => import("./components/Candidate/CandidateInstruction"));
const CandidateInterface = React.lazy(() => import("./components/Candidate/CandidateInterface"));
const PublicRegister = React.lazy(() => import("./components/Candidate/PublicRegister"));
const QueryUi = React.lazy(() => import("./components/Candidate/QueryUi"));
const SelectTech = React.lazy(() => import("./components/Candidate/SelectTech"));
const TakePicture = React.lazy(() => import("./components/Candidate/TakePicture"));
const ThankYouPage = React.lazy(() => import("./components/Candidate/ThankYouPage"));
const CandidateReg = React.lazy(() => import("./components/CandidateReg"));
const AddStaff = React.lazy(() => import("./components/College/AddStaff"));
const AddStudent = React.lazy(() => import("./components/College/AddStudent"));
const CollegeReportList = React.lazy(() => import("./components/College/CollegeReportList"));
const DepatmentList = React.lazy(() => import("./components/College/DepartmentList"));
const StaffList = React.lazy(() => import("./components/College/StaffList"));
const StudentList = React.lazy(() => import("./components/College/StudentList"));
const CompetitorFirstTimeLogin = React.lazy(() => import("./components/Competitor/CompetitorFirstTimeLogin"));
const CompetitorUpdate = React.lazy(() => import("./components/Competitor/CompetitorUpdate"));
const PageNotFound = React.lazy(() => import("./components/PageNotFound"));
const RequireAuth = React.lazy(() => import("./components/RequireAuth"));
const AdvertisementPage = React.lazy(() => import("./components/Student/AdvertisementPage"));
const CompanyOffers = React.lazy(() => import("./components/Student/CompanyOffers"));
const PracticeExamList = React.lazy(() => import("./components/Student/PracticeExamList"));
const StudentFirstTimeLogin = React.lazy(() => import("./components/Student/StudentFirstTimeLogin"));
const StudentTestList = React.lazy(() => import("./components/Student/StudentTestList"));
const AddAdmin = React.lazy(() => import("./components/SuperAdmin/AddAdmin"));
const AddAdvertisement = React.lazy(() => import("./components/SuperAdmin/AddAdvertisement"));
const AddCollege = React.lazy(() => import("./components/SuperAdmin/AddCollege"));
const AddCollegeAdmin = React.lazy(() => import("./components/SuperAdmin/AddCollegeAdmin"));
const AddCompany = React.lazy(() => import("./components/SuperAdmin/AddCompany"));
const AddProcessAdmin = React.lazy(() => import("./components/SuperAdmin/AddProcessAdmin"));
const AddTestAdmin = React.lazy(() => import("./components/SuperAdmin/AddTestAdmin"));
const AdminList = React.lazy(() => import("./components/SuperAdmin/AdminList"));
const AdvertisementHistory = React.lazy(() => import("./components/SuperAdmin/AdvertisementHistory"));
const CollegeAdminList = React.lazy(() => import("./components/SuperAdmin/CollegeAdminList"));
const CollegeList = React.lazy(() => import("./components/SuperAdmin/CollegeList"));
const CompanyList = React.lazy(() => import("./components/SuperAdmin/CompanyList"));
const CompanyPlans = React.lazy(() => import("./components/SuperAdmin/CompanyPlans"));
const CompetitorList = React.lazy(() => import("./components/SuperAdmin/CompetitorList"));
const FreeCredits = React.lazy(() => import("./components/SuperAdmin/FreeCredits"));
const HomePage = React.lazy(() => import("./components/SuperAdmin/HomePage"));
const ListIndustryAndTechnologies = React.lazy(() => import("./components/SuperAdmin/ListIndustryAndTechnologies"));
const Payment = React.lazy(() => import("./components/SuperAdmin/Payment"));
const PlanMaster = React.lazy(() => import("./components/SuperAdmin/PlanMaster"));
const PracticeExam = React.lazy(() => import("./components/SuperAdmin/PracticeExam"));
const PracticeExamTest = React.lazy(() => import("./components/SuperAdmin/PracticeExamTest"));
const ProcessAdminList = React.lazy(() => import("./components/SuperAdmin/ProcessAdminList"));
const RecruiterList = React.lazy(() => import("./components/SuperAdmin/RecruiterList"));
const SectionWeightage = React.lazy(() => import("./components/SuperAdmin/SectionWeightage"));
const Signupcount = React.lazy(() => import("./components/SuperAdmin/Signupcount"));
const Test = React.lazy(() => import("./components/SuperAdmin/Test"));
const TestAdminList = React.lazy(() => import("./components/SuperAdmin/TestAdminList"));
const TestList = React.lazy(() => import("./components/SuperAdmin/TestList"));
const AddQuestion = React.lazy(() => import("./components/TestAdmin/AddQuestion"));
const Dashboard = React.lazy(() => import("./components/TestAdmin/Dashboard"));
const GroupTypesList = React.lazy(() => import("./components/TestAdmin/GroupTypesList"));
const Question = React.lazy(() => import("./components/TestAdmin/Question"));
const ProjectUi = React.lazy(() => import("./components/project-ui/ProjectUI"));
const CandidateRegister = React.lazy(() => import("./components/Candidate/CandidateRegister"));

const EnhancedCandidateInstruction = withLocation(CandidateInstruction);
const EnhancedProgramUI = withLocation(ProgramUI)
const EnhancedQueryUI = withLocation(QueryUi)
const EnhancedCompetitorUpdate = withLocation(CompetitorUpdate)
const EnhancedCandidateRegister = withLocation(CandidateRegister)


function App() {
  return (
    <Suspense fallback={<div className="animated fadeIn pt-1" style={{ position: 'fixed', top: "45%", left: "45%", transform: "translate(-50%, -50%)" }}> <CircleLoader color={'#0000FF'} loading={true} size={150} /></div>}>
      <Routes>
        {/* Public Routes */}
        <Route index element={<AdminLogin />}></Route>
        <Route path="/login" element={<AdminLogin />} />
        <Route path='/admin/forgot/password' element={<ForgetPassword />} />
        <Route path='/register/:token/:examId/:examUsersId' exact element={<EnhancedCandidateRegister />} />
        <Route path='/examResult/:candidateId' element={<TestResults />} />
        <Route path="/project" element={<ProjectUi />} />
        <Route path='/competitor/login' element={<CompetitorFirstTimeLogin />} />
        <Route path='/login/student' element={<StudentFromWebsite />} />
        <Route path="/setpassword" component={<StudentFromWebsite />} />
        <Route path="/candidateinstruction" element={<EnhancedCandidateInstruction />} />
        <Route path="/student/test/selectTech" element={<SelectTech />} />
        <Route path='/test' element={<CandidateInterface />} />
        <Route path='/thankYou' element={<ThankYouPage />} />
        <Route path='/program/:token/:examId/:examUsersId/:collegeId' element={<EnhancedProgramUI />} />
        <Route path='/program/:token/:examId/:examUsersId' element={<EnhancedProgramUI />} />
        <Route path='/program' element={<EnhancedProgramUI />} />
        <Route path='/sql' element={<EnhancedQueryUI />} />
        <Route path="/student/wrong-answers/preview" element={<WronganswerPreview />} />
        <Route path="/candidate/register/:companyId/:examId" element={<PublicRegister />} />
        <Route path="/public-candidate/register/:companyId/:examId" element={<CandidateReg />} />
        <Route path="/candidate/re-exam-request" element={<ReExamRequest />} />
        <Route path="/shortlisted-candidate-details/:candidateId" element={<ShortListedResultDetails />} />
        <Route path="/admin/result/candidate/details/:candidate_id" element={<CandidateResultDetails />} />
        <Route path="/admin/result/candidate/programResult/:candidate_id" element={<ProgramResult />} />
        <Route path='/candidate-details/:examResultId' element={<SharedCandidateDetails />} />
        <Route path="/project-result/:resultId" element={<ProjectResultView />} />
        <Route path='/set/password/:token/:id/:role' element={<LoginRegistration/>} />
        {/* Private Routes */}
        <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
          <Route path="/home" element={<HomePage />} />
        </Route>
        <Route path="/" element={<SuperAdminLayout />} >
          <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
            <Route path="/collegeadmin" element={<CollegeList />} />
            <Route path="/companyadmin" element={<CompanyList />} />
            <Route path="/panelists" element={<RecruiterList />} />
            <Route path="/panelists/verify" element={<VerifyRecruiter />} />
            <Route path="/panelists/timeSlot" element={<RecruiterTimeSlot />} />
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
              <RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />
            }
          >
            <Route path="/college" element={<StudentList />} />
            <Route path="/college/placement-coordinator" element={<StaffList />} />
            <Route path="/college/placement-coordinator/edit" element={<AddStaff />} />
            <Route path="/college/collegeReport" element={<CollegeReportList />} />
            <Route path="/college/add" element={<AddStudent />} />
            <Route path="/college/edit" element={<AddStudent />} />
            <Route path="/college/placement-coordinator/add" element={<AddStaff />} />
          </Route>
          <Route
            element={
              <RequireAuth allowedRoles={["ADMIN", "HR", "HR_MANAGER", "TRIAL_ADMIN"]} />
            }
          >
            <Route path="/admin/candidates" element={<CandidateList />} />
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
            <Route path="/admin/profile" element={<Profile />} />

          </Route>
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
          <Route element={<RequireAuth allowedRoles={["COLLEGE_STUDENT", "COMPETITOR", "DEMO_ROLE"]} />}>
            <Route path="/student" element={<StudentFirstTimeLogin />} />
            <Route path="/student/profile" element={<StudentFirstTimeLogin />} />
            <Route path="/student/student-test" element={<StudentTestList />} />
            <Route path="/student/company-offer" element={<CompanyOffers />} />
            <Route path="/student/practice-exam" element={<PracticeExamList />} />
            <Route path="/student/advertisement" element={<AdvertisementPage />} />

            <Route path='/competitor/testList' element={<StudentTestList />} />
            <Route path='/competitor/update' element={<EnhancedCompetitorUpdate />} />
            <Route path='/competitor/company-offer' element={<CompanyOffers />} />
            <Route path='/competitor/test/takePicture' element={<TakePicture />} />
            <Route path='/competitor/test/selectTech' element={<SelectTech />} />
          </Route>

          <Route element={<RequireAuth allowedRoles={["PROCESS_ADMIN"]} />}>
            <Route path="/processadmin" element={<CompanyList />} />
            <Route path="/processadmin/company" element={<CompanyList />} />
            <Route path="/processadmin/company/test" element={<ExamListProcesss />} />
            <Route path="/processadmin/company/test/candidate" element={<CandidateLists />} />
            <Route path="/processadmin/company/test/candidate/sendmail" element={<SendMail />} />
          </Route>

        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </Suspense>
  );

}


export default App;


