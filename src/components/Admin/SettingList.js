import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader, errorHandler } from '../../api/Api';
import { toastMessage } from '../../utils/CommonUtils';
import { CustomTable } from '../../utils/CustomTable';
import Pagination from '../../utils/Pagination';
import { url } from '../../utils/UrlConstant';
import SettingModel from '../Admin/SettingModel';
import { Tooltip } from 'react-tooltip';
export default class SettingList extends Component {

  state = {
    setting: [],
    loader: true,
    currentPage: 1,
    openModal: false,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
    numberOfElements: 0,
    startPage: 1,
    endPage: 5,
  }

  componentDidMount() {
    this.setState({ loader: true })
    axios.get(`${url.ADMIN_API}/setting/list?page=${this.state.currentPage}&size=${this.state.pageSize}`, {
      headers: authHeader(),
    })
      .then((res) => {
        this.setState({ setting: res.data.response.content, loader: false, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements }, () => this.setTableJson())
      }).catch((error) => {
        errorHandler(error);
        this.setState({ loader: false });
      });
  }

  setTableJson = () => {
    const headers = [{
      name: 'S.NO',
      align: 'center',
      key: 'S.NO',
    }, {
      name: 'Name',
      align: 'left',
      key: 'name'
    }, {
      name: 'Qualification',
      align: 'left',
      key: 'qualifications',
      renderCell: (setting, index) => {
        return (<>
          <div data-tip data-for={"Qualifications" + index}>
            <span>{this.renderQualification(setting.qualifications)}</span>
          </div>
          <Tooltip
            id={"Qualifications" + index}
            place="bottom"
            type="dark"
          > <p>{setting.qualifications?.map((value, _index) => {
            return <span key={value}>{value}{setting.qualifications.length === _index + 1 ? null : "/"}</span>
          })}</p>
          </Tooltip>
        </>)
      }
    }, {
      name: 'AGE LIMIT',
      align: 'left',
      key: ['min', ' ', '-', ' ', 'max'],
      concat: true
    }, {
      name: 'sslc score',
      align: 'right',
      key: 'sslcPercentage'
    }, {
      name: 'hsc score',
      align: 'right',
      key: 'hscPercentage'
    }, {
      name: 'Ug score',
      align: 'right',
      key: 'ugPercentage'
    }, {
      name: 'interval',
      key: ['number', ' ', 'interval'],
      concat: true
    }, {
      name: 'Action',
      key: 'action',
      renderCell: (setting) => <i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.deleteSettingHandler(setting)} title='Delete Setting' style={{ cursor: 'pointer', color: '#3B489E' }}></i>
    }
    ]
    this.setState({ headers })
  }

  increment = (_event) => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = (_event) => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  onNextPage = () => {
    axios.get(`${url.ADMIN_API}/setting/list?page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          setting: res.data.response.content,
          loader: false,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements
        })
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  }

  deleteSettingHandler = (data) => {
    let settingId = data.id;
    axios.delete(` ${url.ADMIN_API}/setting/remove/${settingId}`, { headers: authHeader() })
      .then(() => {
        toastMessage('success', 'Setting deleted successfully!');
        this.componentDidMount();
      }).catch(error => {
        this.setState({ loader: false });
        errorHandler(error);
      })
  };

  onClickOpenModel = () => {
    if (!this.state.openModal) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    this.setState({ openModal: !this.state.openModal });
  };

  onCloseModal = () => {
    this.setState({ openModal: !this.state.openModal });
    this.componentDidMount();
  };


  handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      this.setState({ openModal: !this.state.openModal });
      this.componentDidMount();
    }
  };

  renderQualification = (qualification) => {
    let qual = _.map(qualification, value => {
      return value
    }).join("/")
    return qual.length > 20 ? qual.slice(0, 20) + "..." : qual;
  }

  render() {
    return (
      <div>
        <div className="card-header-new">
          <div className="row">
            <div className="col-md-5">
              <span className="card-title">Settings</span>
            </div>
            <div className="col-md-5"></div>
            <div className='col-md-2'>
              <button type="button" onClick={this.onClickOpenModel} className="btn btn-sm btn-nxt float-right" style={{ marginTop: "5px" }}>Add Setting</button>
              {this.state.openModal ? (<SettingModel onCloseModal={this.onCloseModal} />) : ("")}
            </div>
          </div>
        </div>
        <CustomTable data={this.state.setting}
          headers={this.state.headers}
          loader={this.state.loader}
          pageSize={this.state.pageSize}
          currentPage={this.state.currentPage}
        />
        {this.state.numberOfElements === 0 ? '' :
          <Pagination
            totalPages={this.state.totalPages}
            currentPage={this.state.currentPage}
            onPagination={this.onPagination}
            increment={this.increment}
            decrement={this.decrement}
            startPage={this.state.startPage}
            numberOfElements={this.state.numberOfElements}
            endPage={this.state.endPage}
            totalElements={this.state.totalElements}
            pageSize={this.state.pageSize}

          />}
      </div>
    )
  }
}