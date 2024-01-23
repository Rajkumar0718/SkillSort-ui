import { Route, Routes } from "react-router-dom";
import Layout from "./common/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import AddQuestion from "./components/TestAdmin/AddQuestion";
import AddStaff from "./components/college/AddStaff";
import CollegeReportList from "./components/college/CollegeReportList";
import StaffList from "./components/college/StaffList";
import StudentList from "./components/college/StudentList";
import  './assests/css/AdminDashboard.css';
import './assests/css/SuperAdminDashboard.css';
import Dashboard from "./components/TestAdmin/Dashboard";
import SectionList from "./components/TestAdmin/SectionList";
import Question from "./components/TestAdmin/Question";
import SettingList from "./components/Admin/SettingList";
import GroupTypesList from "./components/TestAdmin/GroupTypesList";


function App() {
  return (
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
          <Route path="/college/placement-coordinator" element = {<StaffList/>} />
          <Route path="/college/placement-coordinator/add" element = {<AddStaff />} />
          <Route path="/college/collegeReport" element={<CollegeReportList/>} />        
        </Route>
        <Route element={<RequireAuth allowedRoles={["TEST_ADMIN"]}/>}>
           <Route path="/testadmin/dashboard"  name= 'Dashboard'  element={<Dashboard />} />
           <Route path="/testadmin/section"  name= 'Sections'  element={<SectionList />} />
           <Route path="/testadmin/question"  name= 'Questions'  element={<Question />} />
           <Route path="/testadmin/question/add"  name= 'Add Question'  element={<AddQuestion />} />
           <Route path="/testadmin/question/edit"  name= 'Edit Question'  element={<AddQuestion />} />
           <Route path="/testadmin"  name= 'Test List'  element={<Question />} />
           <Route path="/testadmin/setting"  name= 'Setting List'  element={<SettingList />} />
           <Route path="/testadmin/grouptypes"    element={<GroupTypesList />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
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