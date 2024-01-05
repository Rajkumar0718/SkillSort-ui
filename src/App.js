import AdminLogin from "./components/Admin/AdminLogin";
import { useRoutes } from "react-router-dom";
import HomePage from "./components/SuperAdmin/HomePage";
import PageNotFound from "./components/PageNotFound";
import CollegeList from "./components/SuperAdmin/CollegeList";
import CollegeLayout from "./container/CollegeLayout";

function App() {
  const routes = useRoutes([
    { path: "/", element: <AdminLogin /> },
    { path: "/login", element: <AdminLogin /> },
    { path: "/home", element: <HomePage /> },
    { path: "/404", element: <PageNotFound /> },
    { path: "/collegeadmin", element: <CollegeList /> },
    { path: "/college/*", element: <CollegeLayout></CollegeLayout> },
  ]);
  return routes;
}

export default App;
