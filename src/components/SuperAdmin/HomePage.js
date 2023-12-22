import _ from 'lodash';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../assests/css/SuperAdminDashboard.css';
import HomeHeader from '../../common/Header';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const [showSidenav,setShowSidenav] = useState(false);
    const navigate = useNavigate();

    const toggleButtonClicked = () => {
        setShowSidenav(prev => !prev.showSidenav);
    };

    const logOut = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    const screens = [
        { name: 'College', icon: 'fa fa-graduation-cap', path: "/collegeadmin" },
        { name: 'Company', icon: 'fa fa-building-o', path: "/companyadmin" },
        { name: 'Panelist', icon: 'fa fa-id-badge', path: "/panelists" },
        { name: 'Report', icon: 'fa fa-file-text-o', path: "/report" },
        { name: 'SkillSort Admin', icon: 'fa fa-user-circle-o', path: "/skillsortadmin" },
        { name: 'Settings', icon: 'fa fa-gear', path: "/settings" }
    ]


  return (
    <div>
        <div className='foot-bg' style={{ height: '100vh', overflow: 'hidden' }}>
            {/* <HomeHeader onClickToggled={toggleButtonClicked} logOut={() => logOut()} showSidenav={showSidenav}></HomeHeader> */}
            <div style={{ padding: '30px 10px 10px 10px' }}>
            <div className='dash-head'>SkillSort Dashboard</div>
            <div className="row" style={{ justifyContent: 'center' }}>
                {_.map(screens, (s, idx) =>
                <div key={idx} className='col-12 col-lg-4 col-sm-6 col-xl-2 col-md-4 d-flex' style={{ flexDirection: "column" }}>
                    <div className="home" style={{ backgroundColor: idx % 2 === 0 ? "#3B489E" : "#F05A28" }}>
                    <Link className="dash-img" to={s.path}> {s.icon ?
                        <i style={{ color: '#FFFFFF', fontSize: '5rem', margin: 'auto' }} className={s.icon} aria-hidden="true"></i>
                        : <img src={s.img} alt={s.name} className="sidenav-img" style={{ margin: 'auto' }} />}
                    </Link>
                    </div>
                    <Link to={s.path} style={{ textAlign: "center" }}>
                    <div className='dash-text'>{s.name}</div>
                    </Link>
                </div>)}
            </div>
            </div>
            <div style={{ position: 'fixed', bottom: '1rem', left: '3rem' }}>
            </div>
        </div>
    </div>
  )
}

export default HomePage