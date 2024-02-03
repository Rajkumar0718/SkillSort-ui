import { Suspense } from 'react';
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./assests/css/AdminDashboard.css";
import Layout from './common/Layout';
import AddHr from "./components/Admin/AddHr";
import AdminLogin from "./components/Admin/AdminLogin";
import CandidateDetailsOnGoingExam from "./components/Admin/CandidateDetailsOnGoingExam";
import ExamList from "./components/Admin/ExamList";
import ListHr from "./components/Admin/ListHr";
import OnGoingExam from "./components/Admin/OnGoingExam";
import Position from "./components/Admin/Position";
import PositionDetails from "./components/Admin/PositionDetails";
import SectionList from "./components/Admin/SectionList";
import SettingList from "./components/Admin/SettingList";
import VacancyHistory from "./components/Admin/VacancyHistory";
import CandidateInterface from "./components/Candidate/CandidateInterface";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import PracticeExamList from "./components/Student/PracticeExamList";
import StudentFirstTimeLogin from "./components/Student/StudentFirstTimeLogin";
import StudentTestList from "./components/Student/StudentTestList";
import AddQuestion from "./components/TestAdmin/AddQuestion";
import Dashboard from "./components/TestAdmin/Dashboard";
import GroupTypesList from "./components/TestAdmin/GroupTypesList";
import Question from "./components/TestAdmin/Question";
import AddExam from "./components/Admin/AddExam";
import SMTPConfig from "./components/Admin/SMTPConfig";
import StudentList from "./components/college/StudentList";
import ProgramUI from "./components/Candidate/ProgramUI";
import QueryUi from "./components/Candidate/QueryUi";
import SelectTech from "./components/Candidate/SelectTech";
import AdvertisementPage from "./components/Student/AdvertisementPage";
import { withLocation } from "./utils/CommonUtils";


const EnhancedCandidateInstruction = withLocation(CandidateInstruction);
const EnhancedProgramUI = withLocation(ProgramUI)
const EnhancedQueryUI = withLocation(QueryUi)


function App() {
  return (
    //     <div>
    //       <Suspense fallback="Loading...">
    //         <Routes>
    //           <Route index element={<AdminLogin />}></Route>
    //           <Route path="/login" element={<AdminLogin />} />
    //           <Route element={<RequireAuth allowedRoles={["ROLE_CANDIDATE"]} />}>
    //             <Route path="/project" element={<ProjectUi />} />
    //           </Route>


    //           {/* Public Routes */}
    //           <Route path="/" element={<Layout />}>
    //             {/* Protected Routes */}
    //             <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />}>
    //               <Route path="/college" element={<StudentList />} />
    //               <Route path="/college/edit" element={<AddStudent />} />
    //               <Route path="/college/add" element={<AddStudent />} />
    //               <Route path="/college/placement-coordinator" element={<StaffList />} />
    //               <Route path="/college/placement-coordinator/add" element={<AddStaff />} />
    //               <Route path="/college/placement-coordinator/edit" element={<AddStaff />} />
    //               <Route path="/college/collegeReport" element={<CollegeReportList />} />
    //             </Route>
    //             <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "COLLEGE_STAFF"]} />}>
    //               {/* <Route path="/companyadmin" element={<CompanyList />} /> */}
    //               <Route path="/home" element={<HomePage />} />
    //             </Route>
    //             <Route element={<RequireAuth allowedRoles={["TEST_ADMIN"]} />}>

    //       <Routes>
    //       <Route
    //           path="/shortlisted-candidate-details/:candidateId"
    //           element={<ShortListedResultDetails />}
    //         />
    //           <Route
    //           path="/admin/result/candidate/details/:candidate_id"
    //           element={<CandidateResultDetails />}
    //         />

    //         <Route
    //           path="/admin/result/candidate/programResult/:candidate_id"
    //           element={<ProgramResult />}
    //         />
    //         {/* Public Routes */}
    //         <Route index element={<AdminLogin />}></Route>
    //         <Route path="/login" element={<AdminLogin />} />
    //         <Route path="/" element={<Layout />}>
    //           {/* Protected Routes */}
    //           {/* <Route
    //             element={
    //               <RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />
    //             }
    //           >
    //             <Route path="/college" element={<StudentList />} />
    //             <Route
    //               path="/college/placement-coordinator"
    //               element={<StaffList />}
    //             />
    //             <Route
    //               path="/college/placement-coordinator/add"
    //               element={<AddStaff />}
    //             />
    //             <Route
    //               path="/college/collegeReport"
    //               element={<CollegeReportList />}
    //             />
    //             <Route path="/college/add" element={<AddStudent />} />
    //           </Route> */}
    //           <Route
    //             element={
    //               <RequireAuth allowedRoles={["ADMIN"]} />
    //             }
    //           >
    //             <Route path="/admin/vacancy" element={<Position />} />
    //             <Route path="/admin/vacancy/history" element={<VacancyHistory />} />
    //             <Route path="/admin/vacancy/add" element={<PositionDetails />} />
    //             <Route path="/admin/vacancy/edit" element={<PositionDetails />} />
    //             <Route path="/admin/vacancy/skillsort" element={<PositionDetails />} />
    //             <Route path="/admin/vacancy/result" element={<PositionDetails />} />
    //             <Route path="/admin/setting" element={<SettingList />} />
    //             <Route path="/admin/hr" element={<ListHr />} />
    //             <Route path="/admin/hr/add" element={<AddHr />} />
    //             <Route path="/admin/hr/edit" element={<AddHr />} />
    //             <Route path="/admin/onGoingTest" element={<OnGoingExam />} />
    //             <Route path="/admin/onGoingTest/candidate" element={<CandidateDetailsOnGoingExam />} />
    //             <Route path="/admin/test" element={<ExamList />} />
    //             <Route path='/admin/test/add' element={<AddExam />} />
    //             <Route path='/admin/test/edit' element={<AddExam />} />
    //             <Route path='/admin/section' element={<SectionList />} />
    //             <Route path='/admin/questions' element={<Question />} />
    //             <Route path='/admin/questions/add' element={<AddQuestion />} />
    //             <Route path='/admin/questions/edit' element={<AddQuestion />} />
    //             <Route path="/admin/smtp" element={<SMTPConfig />} />
    //             <Route path="admin/vacancy/Exam-add" element={<AddExam />} />
    //           </Route>
    //           <Route path="*" element={<PageNotFound />} />
    //           <Route path="/college/collegeReport"
    //             element={<CollegeReportList />}
    //           />
    //           <Route path="/college/add" element={<AddStudent />} />
    //         <Route element={<RequireAuth allowedRoles={["TEST_ADMIN"]} />}>

    //             </Route>
    //           <Route element={<RequireAuth allowedRoles={["COLLEGE_STUDENT"]} />}>
    //            <Route path="/student" element={<StudentFirstTimeLogin />} />
    //            <Route path="/student/profile" element={<StudentFirstTimeLogin />} />
    //            <Route path="/student/student-test" element={<StudentTestList />} />
    //            <Route path="/student/company-offer" element={<CompanyOffers />} />
    //            <Route path="/student/student-practice-exam" element={<PracticeExamList />} />
    //            <Route path="/student/advertisement" element={<AdvertisementPage />} />
    //         </Route>
    //           </Route>
    //           <Route path="*" element={<PageNotFound />} />
    //         </Routes>
    //       </Suspense>
    //       <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
    //         autoClose={1700} />
    //     </div>
    <div>
      <Suspense fallback="Loading...">
        <Routes>
          <Route index element={<AdminLogin />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route element={<RequireAuth allowedRoles={["ROLE_CANDIDATE"]} />}>
            <Route path="/project" element={<ProjectUi />} />
          </Route>
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
          <Route path="/candidate/register/:companyId/:examId" element={<PublicRegister />} />
          <Route path="/public-candidate/register/:companyId/:examId" element={<CandidateReg />} />
          <Route path="/candidate/re-exam-request" element={<ReExamRequest />} />
          <Route path="/" element={<Layout />}>
            {/* Protected Routes */}
            <Route element={<RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />}>
              <Route path="/college" element={<StudentList />} />
              {/* ... (other college routes) ... */}
            </Route>

            <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN", "COLLEGE_STAFF"]} />}>
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

            {/* ... (other public routes) ... */}
          </Route>

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true} autoClose={1700} />
    </div>
  );
}

export default App;
