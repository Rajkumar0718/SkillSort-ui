import React from "react";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "../components/RequireAuth";
import SuperAdminLayout from "../common/SuperAdminLayout";

const AddAdmin = React.lazy(() => import("../components/SuperAdmin/AddAdmin"));
const AddAdvertisement = React.lazy(() => import("../components/SuperAdmin/AddAdvertisement"));
const AddCollege = React.lazy(() => import("../components/SuperAdmin/AddCollege"));
const AddCollegeAdmin = React.lazy(() => import("../components/SuperAdmin/AddCollegeAdmin"));
const AddCompany = React.lazy(() => import("../components/SuperAdmin/AddCompany"));
const AddProcessAdmin = React.lazy(() => import("../components/SuperAdmin/AddProcessAdmin"));
const AddTestAdmin = React.lazy(() => import("../components/SuperAdmin/AddTestAdmin"));
const AdminList = React.lazy(() => import("../components/SuperAdmin/AdminList"));
const AdvertisementHistory = React.lazy(() => import("../components/SuperAdmin/AdvertisementHistory"));
const CollegeAdminList = React.lazy(() => import("../components/SuperAdmin/CollegeAdminList"));
const CollegeList = React.lazy(() => import("../components/SuperAdmin/CollegeList"));
const CompanyList = React.lazy(() => import("../components/SuperAdmin/CompanyList"));
const CompanyPlans = React.lazy(() => import("../components/SuperAdmin/CompanyPlans"));
const CompetitorList = React.lazy(() => import("../components/SuperAdmin/CompetitorList"));
const FreeCredits = React.lazy(() => import("../components/SuperAdmin/FreeCredits"));
const HomePage = React.lazy(() => import("../components/SuperAdmin/HomePage"));
const ListIndustryAndTechnologies = React.lazy(() => import("../components/SuperAdmin/ListIndustryAndTechnologies"));
const Payment = React.lazy(() => import("../components/SuperAdmin/Payment"));
const PlanMaster = React.lazy(() => import("../components/SuperAdmin/PlanMaster"));
const PracticeExam = React.lazy(() => import("../components/SuperAdmin/PracticeExam"));
const PracticeExamTest = React.lazy(() => import("../components/SuperAdmin/PracticeExamTest"));
const ProcessAdminList = React.lazy(() => import("../components/SuperAdmin/ProcessAdminList"));
const RecruiterList = React.lazy(() => import("../components/SuperAdmin/RecruiterList"));
const SectionWeightage = React.lazy(() => import("../components/SuperAdmin/SectionWeightage"));
const Signupcount = React.lazy(() => import("../components/SuperAdmin/Signupcount"));
const Test = React.lazy(() => import("../components/SuperAdmin/Test"));
const TestAdminList = React.lazy(() => import("../components/SuperAdmin/TestAdminList"));
const TestList = React.lazy(() => import("../components/SuperAdmin/TestList"));
const DepatmentList = React.lazy(() => import("../components/College/DepartmentList"));
const SMTPConfig = React.lazy(() => import("../components/Admin/SMTPConfig"));
const VerifyRecruiter = React.lazy(() => import("../components/SuperAdmin/VerifyRecruiter"));
const RecruiterTimeSlot = React.lazy(() => import("../components/SuperAdmin/RecruiterTimeSlot"));
const AdvSearch = React.lazy(() => import("../components/Admin/AdvanceSearch"));



export default function SuperAdminRoutes() {
  return <Routes>
    <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
      <Route path="/home" element={<HomePage />} />
    </Route>
    <Route element={<SuperAdminLayout />} >
      <Route element={<RequireAuth allowedRoles={["SUPER_ADMIN"]} />}>
        <Route path="/collegeadmin" element={<CollegeList />} />
        <Route path="/companyadmin" element={<CompanyList />} />
        <Route path="/panelists" element={<RecruiterList />} />
        <Route path="/panelists/verify" element={<VerifyRecruiter />} />
        <Route path="/panelists/timeSlot" element={<RecruiterTimeSlot />} />
        <Route path="/panelists/payment" element={<Payment />} />
        <Route path="/settings/department" element={<DepatmentList />} />
        <Route path="/settings/practiceExam" element={<PracticeExam />} />
        <Route path="/settings/practiceExam/addPracticeExam" element={<PracticeExamTest />} />
        <Route path="/settings/practiceExam/viewPracticeExam" element={<PracticeExamTest />} />
        <Route path="/settings/test" element={<TestList />} />
        <Route path="/settings/test/addtest" element={<Test />} />
        <Route path="/settings/test/view" element={<Test />} />
        <Route path="/settings/plan-master" element={<PlanMaster />} />
        <Route path="/skillsortadmin" element={<ProcessAdminList />} />
        <Route path="/skillsortadmin/edit" element={<AddProcessAdmin />} />
        <Route path="/skillsortadmin/testadmin" element={<TestAdminList />} />
        <Route path="/skillsortadmin/testadmin/add" element={<AddTestAdmin />} />
        <Route path="/skillsortadmin/testadmin/edit" element={<AddTestAdmin />} />
        <Route path="/skillsortadmin/advertisement" element={<AdvertisementHistory />} />
        <Route path="/skillsortadmin/advertisement/add" element={<AddAdvertisement />} />
        <Route path="/skillsortadmin/advertisement/edit" element={<AddAdvertisement />} />
        <Route path="/settings" element={<ListIndustryAndTechnologies />} />
        <Route path="/settings/smtp" element={<SMTPConfig />} />
        <Route path="/settings/weightage" element={<SectionWeightage />} />
        <Route path="/settings/freeCredits" element={<FreeCredits />} />
        <Route path="/report" element={<CompetitorList />} />
        <Route caseSensitive path="/collegeadmin/add" name="Add" element={<AddCollege />} />
        <Route path="/collegeadmin/edit" name="edit" element={<AddCollege />} />
        <Route caseSensitive path="/collegeadmin/admin" element={<CollegeAdminList />} />
        <Route path="/collegeadmin/admin/add" name="add" element={<AddCollegeAdmin />} />
        <Route path="/collegeadmin/admin/edit" name="edit" element={<AddCollegeAdmin />} />
        <Route path="/companyadmin/plan" element={<CompanyPlans />} />
        <Route path="/companyadmin/add" name="add" element={<AddCompany />} />
        <Route path="/companyadmin/edit" name="edit" element={<AddCompany />} />
        <Route path='/companyadmin/admin' name="Company Admins" element={<AdminList />} />
        <Route path='/companyadmin/admin/add' name="Add" element={<AddAdmin />} />
        <Route path='/companyadmin/admin/edit' name="edit" element={<AddAdmin />} />
        <Route path="/skillsortadmin/add" element={<AddProcessAdmin />} />
        <Route path="/report/advance-search" element={<AdvSearch />} />
        <Route path="/report/activity-dashboard" element={<Signupcount />} />

      </Route>
    </Route>
  </Routes>
}