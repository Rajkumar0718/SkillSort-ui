import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./assests/css/AdminDashboard.css";
import Layout from "./common/Layout";
import AddExam from "./components/Admin/AddExam";
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
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import AddQuestion from "./components/TestAdmin/AddQuestion";
import Question from "./components/TestAdmin/Question";
import Dashboard from "./components/TestAdmin/Dashboard"
import AddStudent from "./components/college/AddStudent";
import CollegeReportList from "./components/college/CollegeReportList";
import GroupTypesList from "./components/TestAdmin/GroupTypesList"
import ProgramResult from "./components/Admin/ProgramResult";
import SMTPConfig from "./components/Admin/SMTPConfig";
import CandidateResultDetails from "./components/Admin/CandidateResultDetails";
import ShortListedResultDetails from "./components/Admin/ShortListedResultDetails"
function App() {
  return (
    <>
      <Routes>
      <Route
          path="/shortlisted-candidate-details/:candidateId"
          element={<ShortListedResultDetails />}
        />
          <Route
          path="/admin/result/candidate/details/:candidate_id"
          element={<CandidateResultDetails />}
        />

        <Route
          path="/admin/result/candidate/programResult/:candidate_id"
          element={<ProgramResult />}
        />
        {/* Public Routes */}
        <Route index element={<AdminLogin />}></Route>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          {/* <Route
            element={
              <RequireAuth allowedRoles={["COLLEGE_ADMIN", "COLLEGE_STAFF"]} />
            }
          >
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
          </Route> */}
          <Route
            element={
              <RequireAuth allowedRoles={["ADMIN"]} />
            }
          >
            <Route path="admin/vacancy" element={<Position />} />
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
        </Route>
      </Routes>
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true}
        autoClose={1700} />
    </>
  );

}




export default App;
