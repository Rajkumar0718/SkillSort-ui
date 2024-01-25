import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLogin from "./components/Admin/AdminLogin";
import HomePage from "./components/SuperAdmin/HomePage";
import PageNotFound from "./components/PageNotFound";
import CollegeList from "./components/SuperAdmin/CollegeList";
import CollegeLayout from "./container/CollegeLayout";
import Layout from "./common/Layout";
import StudentList from "./components/college/StudentList";
import RequireAuth from "./components/RequireAuth";
import StaffList from "./components/college/StaffList";
import AddStaff from "./components/college/AddStaff";
import AddStudent from "./components/college/AddStudent";
import CollegeReportList from "./components/college/CollegeReportList";
import ListHr from "./components/Admin/ListHr";
import AddHr from "./components/Admin/AddHr";
import OnGoingExam from "./components/Admin/OnGoingExam";
import CandidateDetailsOnGoingExam from "./components/Admin/CandidateDetailsOnGoingExam";

function App() {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route index element={<AdminLogin />}></Route>
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
            <RequireAuth allowedRoles={["ADMIN"]} />
          }
        >  
          <Route path="/admin/hr" element={<ListHr />} />
          <Route path="/admin/hr/add" element={<AddHr />} />
          <Route path="/admin/hr/edit" element={<AddHr />} />
          <Route path="/admin/onGoingTest" element={<OnGoingExam />} />
          <Route path="/admin/onGoingTest/candidate" element={<CandidateDetailsOnGoingExam />} />
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
