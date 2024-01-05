import React from 'react';
const StaffList = React.lazy(() => import('../components/college/StaffList'));
const StaffAdd = React.lazy(() => import('../components/college/AddStaff'));
const CollegeRoutes = [
  { path: "/college/placement-coordinator", component: StaffList },
  {path:"/college/placement-coordinator/add",component: StaffAdd}
];
export default CollegeRoutes;
