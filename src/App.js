import { Route, Routes } from "react-router-dom";
import Layout from "./common/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import AddQuestion from "./components/TestAdmin/AddQuestion";
import AddStaff from "./components/college/AddStaff";
import CollegeReportList from "./components/college/CollegeReportList";
import AddStudent from "./components/college/AddStudent";
import ListHr from "./components/Admin/ListHr";
import AddHr from "./components/Admin/AddHr";
import OnGoingExam from "./components/Admin/OnGoingExam";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
// { path: '/testadmin/dashboard', name: 'Dashboard', component: Dashboard },
// { path: '/testadmin/section', name: 'Sections', component: SectionList },
// { path: '/testadmin/question', name: 'Questions', component: QuestionList },
// { path: '/testadmin/question/add', name: 'Add Question', component: AddQuestion },
// { path: '/testadmin/question/edit', name: 'Edit Question', component: AddQuestion },
// { path: '/testadmin', name: "Test List", component: QuestionList },
// { path: '/testadmin/add', name: 'Add Test', component: AddExam },
// { path: '/testadmin/edit', name: 'Edit Test', component: AddExam },
// { path: '/testadmin/setting', name: 'Setting List', component: SettingList },
// { path: "/testadmin/smtp", name: 'SMTP', component: SMTPConfig },
// { component: PageNotFound }