import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./assests/css/AdminDashboard.css";
import Layout from "./common/Layout";
import AddHr from "./components/Admin/AddHr";
import AdminLogin from "./components/Admin/AdminLogin";
import CandidateDetailsOnGoingExam from "./components/Admin/CandidateDetailsOnGoingExam";
import ExamList from "./components/Admin/ExamList";
import ListHr from "./components/Admin/ListHr";
import OnGoingExam from "./components/Admin/OnGoingExam";
import Position from "./components/Admin/Position";
import PositionDetails from "./components/Admin/PositionDetails";
import SettingList from "./components/Admin/SettingList";
import ShortListedResultDetails from "./components/Admin/ShortListedResultDetails";
import VacancyHistory from "./components/Admin/VacancyHistory";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import AddStaff from "./components/college/AddStaff";
import AddStudent from "./components/college/AddStudent";
import CollegeReportList from "./components/college/CollegeReportList";
import StaffList from "./components/college/StaffList";
import StudentList from "./components/college/StudentList";
import AddExam from "./components/Admin/AddExam";
import SectionList from "./components/Admin/SectionList";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route index element={<AdminLogin />}></Route>
        <Route path='/shortlisted-candidate-details/:candidateId' element={<ShortListedResultDetails />} />
        {/* <Route path='/admin/result/candidate/programResult/:candidate_id' element={<ProgramResult />} /> */}

        <Route path="/login" element={<AdminLogin />} />
        <Route path="/" element={<Layout />}>
          {/* Protected Routes */}
          <Route
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
          </Route>
          <Route
            element={
              <RequireAuth
                allowedRoles={["ADMIN", "HR", "HR_MANAGER", "TRIAL_ADMIN"]}
              />
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
            <Route path= '/admin/section' element ={<SectionList />} />

          </Route>
          <Route path="*" element={<PageNotFound />} />
          <Route path="/college/collegeReport"
            element={<CollegeReportList />}
          />
          <Route path="/college/add" element={<AddStudent />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        hideProgressBar={true}
        newestOnTop={true}
        autoClose={1700}
      />
    </>
  );
}




export default App;