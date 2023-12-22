import AdminLogin from "./components/Admin/AdminLogin";
import { Route, Routes } from "react-router-dom";

import HomePage from "./components/SuperAdmin/HomePage";
import PageNotFound from "./components/PageNotFound";
import CollegeList from "./components/SuperAdmin/CollegeList";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/404' element={<PageNotFound />} />
        <Route path="/collegeadmin" element={<CollegeList />} />
      </Routes>
    </div>
  );
}

export default App;
