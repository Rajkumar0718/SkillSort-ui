import React from 'react';


const CompetitorList = React.lazy(() => import('../components/SuperAdmin/CompetitorList'));
const CompetitorDetails = React.lazy(() => import('../components/SuperAdmin/CompetitorDetails'));
const AddSkills = React.lazy(() => import('../components/SuperAdmin/AddSkills'));
const SkillList = React.lazy(() => import('../components/SuperAdmin/SkillList'));
const AddQuestion = React.lazy(() => import('../components/SuperAdmin/AddQuestion'));
const QuestionList = React.lazy(() => import('../components/SuperAdmin/QuestionList'));
const RecruiterList = React.lazy(() => import('../components/SuperAdmin/RecruiterList'));
const VerifyRecruiter = React.lazy(() => import('../components/SuperAdmin/VerifyRecruiter'));
const RecruiterTimeSlot = React.lazy(() => import('../components/SuperAdmin/RecruiterTimeSlot'));
const PageNotFound = React.lazy(() => import('../components/PageNotFound'));

export const RecruiterRoutes = [
    { path: '/recruiter/list', component: RecruiterList },
    { path: '/recruiter/verify', component: VerifyRecruiter },
    { path: '/recruiter/timeSlot', component: RecruiterTimeSlot },
    { component: PageNotFound }
];

export const CompetitorRoutes = [
    { path: '/superadmin/competitor/list', component: CompetitorList },
    { path: '/superadmin/competitor/details', component: CompetitorDetails },
    { path: '/superadmin/add/skills', component: AddSkills },
    { path: '/superadmin/list/skills', component: SkillList },
    { path: '/superadmin/add/question', component: AddQuestion },
    { path: '/superadmin/question/list', component: QuestionList },
    { path: '/superadmin/question/edit', component: AddQuestion },
    { component: PageNotFound }
];


