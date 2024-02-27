import React, { Suspense } from "react";
import { CircleLoader } from "react-spinners";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assests/css/AdminDashboard.css';

import AdminRoutes from "./routes/AdminRoutes";
import CollegeRoutes from "./routes/CollegeRoutes";
import ProcessAdminRoutes from "./routes/ProcessAdminRoutes";
import PublicRoutes from "./routes/PublicRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import SuperAdminRoutes from "./routes/SuperAdminRoutes";
import TestAdminRoutes from "./routes/TestAdminRoutes";

function App() {
  return (
    <Suspense fallback={<div className="animated fadeIn pt-1" style={{ position: 'fixed', top: "45%", left: "45%", transform: "translate(-50%, -50%)" }}> <CircleLoader color={'#0000FF'} loading={true} size={150} /></div>}>
      <PublicRoutes />
      <SuperAdminRoutes />
      <CollegeRoutes />
      <AdminRoutes />
      <TestAdminRoutes />
      <StudentRoutes />
      <ProcessAdminRoutes />
      <ToastContainer position="top-right" hideProgressBar={true} newestOnTop={true} autoClose={1700} />
    </Suspense>

  );

}


export default App;


