import _ from 'lodash';
import React , {useRef,useEffect,useState} from 'react'
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Sidebar = () => {

    const wrapperRef = useRef(null);
    const [showSidenav, setShowSidenav] = useState(false);
    const [sideBarClass, setSideBarClass] = useState('sidebar col-9 sb-1');
  
    const toggleClicked = () => {
      setShowSidenav(!showSidenav);
      openSideBar();
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
      let header = document.getElementById('myDIV');
      let buttons = header.getElementsByClassName('menu-icon');
      _.map(buttons, (_btn, index) => {
        buttons[index].addEventListener('click', function () {
          let current = document.getElementsByClassName('focus');
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
                    <Navbar toggleClicked={toggleClicked} />
                    <hr className='bottom-border' />
                    <Link to="/testadmin/dashboard" onClick={() => changeClass()}>
                        <div className="menu-icon focus">
                            <div className="row link">
                                <div className="col-3">
                                    <div>
                                        <i className="fa fa-tachometer" aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.3rem' }}></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Dashboard</span>
                                </div>
                            </div>
                        </div> </Link>
                    <hr className='bottom-border' />
                    <Link to='/testadmin/section' onClick={() => changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i className="fa fa-columns" aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.3rem' }}></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Section</span>
                                </div>
                            </div>
                        </div> </Link>
                        <hr className='bottom-border' />
                    <Link to='/testadmin/grouptypes' onClick={() => changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i className="fa fa-podcast" aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.3rem' }}></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>GroupTypes</span>
                                </div>
                            </div>
                        </div> </Link>
                    <hr className='bottom-border' />
                    <Link to='/testadmin/question' onClick={() => changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i className="fa fa-question-circle-o" aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.4rem' }}></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Questions</span>
                                </div>
                            </div>
                        </div></Link>
                    <hr className='bottom-border' />
                    <Link to='/testadmin/setting' onClick={() => changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i className="fa fa-cog" aria-hidden="true" style={{ color: '#3b489E', fontSize: '1.4rem' }}></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Setting</span>
                                </div>
                            </div>
                        </div> </Link>
                    <hr className='bottom-border' />
                </div>
            </div>
  )
}

export default Sidebar