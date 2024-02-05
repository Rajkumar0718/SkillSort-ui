import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../../container/NavBar';

export default class SuperAdminRecruiterSidebar extends Component {
    constructor(props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.state = {
            showSidenav: false,
            sideBarClass: "sidebar col-9 sb-1",

        };
    }
    toggleClicked = () => {
        this.setState({ showSidenav: !this.state.showSidenav }, () => this.openSideBar())
    }
    openSideBar = () => {
        if (this.state.showSidenav) this.setState({ sideBarClass: 'sidebar col-9 sb-1-view' })
        else this.setState({ sideBarClass: 'sidebar col-9 sb-1' })
    }
    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
        this.changeClass();
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.setState({ sideBarClass: "sidebar col-9 sb-1", showSidenav: false });
        }
    }

    changeClass = () => {
        let header = document.getElementById("myDIV");
        let buttons = header.getElementsByClassName("menu-icon");
        _.map(buttons, (_btn, index) => {
            buttons[index].addEventListener("click", function () {
                let current = document.getElementsByClassName("focus");
                current[0].className = current[0].className.replace(" focus", "");
                this.className += " focus";
            })
        });
    };
    render() {
        return (
            <div ref={this.wrapperRef} className={this.state.sideBarClass} style={{ paddingLeft: "0px" }}>
                <div className="sidebar-menu" id="myDIV">
                    <NavBar toggleClicked={this.toggleClicked} />
                    <hr className='bottom-border' />
                    <Link to="/home" onClick={() => this.changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div>
                                        <i onClick={this.toggleClicked} style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-home" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Home</span>
                                </div>
                            </div>
                        </div></Link>
                    <hr className='bottom-border' />
                    <Link to='/panelists' onClick={() => this.changeClass()}>
                        <div className="menu-icon focus">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i onClick={this.toggleClicked} style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-user-circle-o" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Panelist</span>
                                </div>
                            </div>
                        </div> </Link>
                    <hr className='bottom-border' />
                    <Link to='/panelists/payment' onClick={() => this.changeClass()}>
                        <div className="menu-icon">
                            <div className="row link">
                                <div className="col-3">
                                    <div data-tip data-for="result">
                                        <i onClick={this.toggleClicked} style={{ fontSize: '1.4rem', color: '#3b489e' }} className="fa fa-money" aria-hidden="true"></i>
                                    </div>
                                </div>
                                <div className="col-9 menu-name">
                                    <span>Payment</span>
                                </div>
                            </div>
                        </div></Link>
                    <hr className='bottom-border' />
                   
                </div>
            </div>
        )
    }
}