import React from 'react';

const Dashboard = React.lazy(() => import('../components/TestAdmin/Dashboard'));
const SectionList = React.lazy(() => import('../components/TestAdmin/SectionList'));
const QuestionList = React.lazy(() => import('../components/TestAdmin/QuestionList'));
const AddQuestion = React.lazy(() => import('../components/TestAdmin/AddQuestion'));
// const ExamList = React.lazy(() => import('../components/Admin/ExamList'));
const AddExam = React.lazy(() => import('../components/Admin/AddExam'));
// const SettingList = React.lazy(() => import('../components/Admin/SettingList'));
// const SMTPConfig = React.lazy(() => import('../components/Admin/SMTPConfig'));
// const PageNotFound = React.lazy(() => import('../components/PageNotFound'));

const TestAdminRoutes = [
    { path: '/testadmin/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/testadmin/section', name: 'Sections', component: SectionList },
    { path: '/testadmin/question', name: 'Questions', component: QuestionList },
    { path: '/testadmin/question/add', name: 'Add Question', component: AddQuestion },
    { path: '/testadmin/question/edit', name: 'Edit Question', component: AddQuestion },
    { path: '/testadmin', name: "Test List", component: QuestionList },
    { path: '/testadmin/add', name: 'Add Test', component: AddExam },
    { path: '/testadmin/edit', name: 'Edit Test', component: AddExam },
    // { path: '/testadmin/setting', name: 'Setting List', component: SettingList },
    // { path: "/testadmin/smtp", name: 'SMTP', component: SMTPConfig },
    // { component: PageNotFound }
]

export default TestAdminRoutes;