import AdminLogin from "./components/Admin/AdminLogin";
import { Route, Routes } from "react-router-dom";
import HomePage from "./components/SuperAdmin/HomePage";
import PageNotFound from "./components/PageNotFound";
import CollegeList from "./components/SuperAdmin/CollegeList";
import SideBar from "./common/SideBar";
import Button from "./common/Button";
import CompanyList from "./components/SuperAdmin/CompanyList";
import RecruiterList from "./components/SuperAdmin/RecruiterList"
import ProcessAdminList from "./components/SuperAdmin/ProcessAdminList";
import ListIndustryAndTechnologies from "./components/SuperAdmin/ListIndustryAndTechnologies";


function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/404' element={<PageNotFound />} />
        <Route path="/collegeadmin" element={<CollegeList />} />
        <Route path="/companyadmin" element={<CompanyList />} />
        <Route path="/panelists" element={<RecruiterList />} />
        <Route path="skillsortadmin" element={<ProcessAdminList/>}/>
        <Route path="settings" element={<ListIndustryAndTechnologies/>}/>
        <Route path="/sideBar" element={<SideBar/>} />
        <Route path="/button" element={<Button />} />
      </Routes>
    </div>
  );
}

export default App;
