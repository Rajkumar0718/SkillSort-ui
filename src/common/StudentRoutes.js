import React from 'react';
import { Route } from 'react-router-dom';
import _ from 'lodash';

const StudentFirstTimeLogin = React.lazy(() => import('../components/Student/StudentFirstTimeLogin'));
const StudentTestList = React.lazy(() => import('../components/Student/StudentTestList'));
const CompanyOffer = React.lazy(() => import('../components/Student/CompanyOffers'));
const PageNotFound = React.lazy(() => import('../components/PageNotFound'));
const PracticeExamList = React.lazy(() => import('../components/Student/PracticeExamList'));
// const TakePicture = React.lazy(() => import('../components/Candidate/TakePicture'));
// const SelectTech = React.lazy(()=> import('../components/Candidate/SelectTech')) ;
const AdvertisementPage = React.lazy(()=>import ('../components/Student/AdvertisementPage'));
const WronganswerPreview = React.lazy(()=>import('../components/Student/WrongAnswerPreview'));

const StudentRoutes = () => {
    const routes = [
        { path: "/student", component: StudentFirstTimeLogin },
        { path: "/student/profile", component: StudentFirstTimeLogin },
        { path: "/student/student-test", component: StudentTestList },
        { path: "/student/company-offer", component: CompanyOffer },
        { path: "/student/student-practice-exam", component: PracticeExamList },
        // { path: "/student/test/takePicture", component: TakePicture},
        // { path: '/student/test/selectTech' , component: SelectTech},
        { path: '/student/advertisement' , component: AdvertisementPage},
        { path: '/student/wrong-answers/preview' , component: WronganswerPreview},
        { path: '*', component: PageNotFound }
    ]
    return (
       _.map(routes, route => {
            <Route key={route.path} path={route.path} element={route.component} />
       })
    )
}
export default StudentRoutes;