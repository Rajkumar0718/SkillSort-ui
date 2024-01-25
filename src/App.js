import { Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assests/css/AdminDashboard.css';
import './assests/css/SuperAdminDashboard.css';
import Layout from "./common/Layout";
import AdminLogin from "./components/Admin/AdminLogin";
import PageNotFound from "./components/PageNotFound";
import RequireAuth from "./components/RequireAuth";
import SectionList from "./components/TestAdmin/SectionList"
import Dashboard from "./components/TestAdmin/Dashboard"
import Question from "./components/TestAdmin/Question"
import AddQuestion from "./components/TestAdmin/AddQuestion"
import GroupTypesList from "./components/TestAdmin/GroupTypesList"
import SettingList from "./components/Admin/SettingList"
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
            <RequireAuth allowedRoles={["TEST_ADMIN"]} />
          }
        >  
          <Route path="/testadmin/dashboard" element={<Dashboard />} />
          <Route path="/testadmin/dashboard" element={<Dashboard />} />
           <Route path='/testadmin/section' element={<SectionList />} />
           <Route path='/testadmin/question' element={<Question />} />
           <Route path='/testadmin/question/add' element={<AddQuestion />} />
           <Route path='/testadmin/question/edit' element={<AddQuestion />} />
           <Route path='/testadmin/grouptypes' element={<GroupTypesList />} />
           <Route path='/testadmin/setting' element={<SettingList />} />





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