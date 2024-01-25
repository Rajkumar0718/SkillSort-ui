import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../container/NavBar';
import _ from 'lodash';

const SuperAdminCompetitorSidebar = () => {
    const wrapperRef = useRef(null);
    const [showSidenav, setShowSidenav] = useState(false);
    const [sideBarClass, setSideBarClass] = useState('sidebar col-9 sb-1');

    const toggleClicked = () => {
        setShowSidenav(!showSidenav);
    };

    const openSideBar = () => {
        if (showSidenav) setSideBarClass('sidebar col-9 sb-1-view');
        else setSideBarClass('sidebar col-9 sb-1');
    };

    const handleClickOutside = (event) => {
        if (wrapperRef && !wrapperRef.current.contains(event.target)) {
            setSideBarClass('sidebar col-9 sb-1');
            setShowSidenav(false);
        }
    };

    const changeClass = () => {
        const header = document.getElementById('myDIV');
        const buttons = header.getElementsByClassName('menu-icon');
        _.map(buttons, (_btn, index) => {
            buttons[index].addEventListener('click', function () {
                const current = document.getElementsByClassName('focus');
                current[0].className = current[0].className.replace(' focus', '');
                this.className += ' focus';
            });
        });
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        changeClass();
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div ref={wrapperRef} className={sideBarClass} style={{ paddingLeft: "0px" }}>
            <div className="sidebar-menu" id="myDIV">
                <NavBar toggleClicked={toggleClicked} />
                <hr className='bottom-border' />
                <Link to="/home" onClick={() => changeClass()}>
                    <div className="menu-icon">
                        <div className="row link">
                            <div className="col-3">
                                <div>
                                    <i style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-home" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="col-9 menu-name">
                                <span>Home</span>
                            </div>
                        </div>
                    </div> </Link>
                <hr className='bottom-border' />
                <Link to='/report' onClick={() => changeClass()}>
                    <div className={window.location.pathname === '/report' ? "menu-icon focus" : "menu-icon"}>
                        <div className="row link">
                            <div className="col-3">
                                <div data-tip data-for="result">
                                    <i style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-file-text-o" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="col-9 menu-name">
                                <span>SkillSort User Report</span>
                            </div>
                        </div>
                    </div></Link>
                <hr className='bottom-border' />
                <Link to='/report/advance-search' onClick={() => changeClass()}>
                    <div className={window.location.pathname === "/report/advance-search" ? "menu-icon focus" : "menu-icon"}>
                        <div className="row link">
                            <div className="col-3">
                                <div data-tip data-for="result">
                                    <i style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-search" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="col-9 menu-name">
                                <span>Advance Search</span>
                            </div>
                        </div>
                    </div></Link>
                <hr className='bottom-border' />
                <Link to="/report/activity-dashboard">
                    <div className={window.location.pathname === "/report/activity-dashboard" ? "menu-icon focus" : "menu-icon"}>
                        <div className="row link">
                            <div className="col-3">
                                <div data-tip data-for="result">
                                    <i style={{ fontSize: '1.3rem', color: '#3b489e' }} className="fa fa-file" aria-hidden="true"></i>
                                </div>
                            </div>
                            <div className="col-9 menu-name">
                                <span>Activity Report</span>
                            </div>
                        </div>
                    </div></Link><hr className='bottom-border' />
            </div>
        </div>
    )
}

export default SuperAdminCompetitorSidebar;