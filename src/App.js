import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import Layout from "./common/Layout";
import StudentList from "./components/college/StudentList";
import RequireAuth from "./components/RequireAuth";
import StaffList from "./components/college/StaffList";
import AddStaff from "./components/college/AddStaff";
import AddStudent from "./components/college/AddStudent";
import Position from "./components/Admin/Position";
import "./assests/css/AdminDashboard.css";
import VacancyHistory from "./components/Admin/VacancyHistory";
import PositionDetails from "./components/Admin/PositionDetails";
import 'react-toastify/dist/ReactToastify.css';
import ShortListedResultDetails from "./components/Admin/ShortListedResultDetails";
import SettingList from "./components/Admin/SettingList";
import CollegeReportList from "./components/college/CollegeReportList"
import ProgramResult from "./components/Admin/ ProgramResult ";
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

          </Route>
          <Route path="*" element={<PageNotFound />} />
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
