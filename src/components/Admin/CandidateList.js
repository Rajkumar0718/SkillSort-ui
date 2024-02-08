import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader } from "../../api/Api";
import Search from '../../common/AdvanceSearch';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import TableHeader from '../../utils/TableHeader';
import url from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import '../Candidate/Styles.css'
import { CustomTable } from '../../utils/CustomTable';
import moment from 'moment/moment';
class CandidateList extends Component {

  constructor(props) {
    const company = JSON.parse(localStorage.getItem('user'))
    super(props);
    this.state = {
      searchValue: '',
      candidates: this.props.location?.state?.candidates || [],
      companyId: company.companyId,
    }
  }
  componentDidMount() {
    this.setTableJson();
  }

  updateState = (candidate) => {
    const { history, location } = this.props;
    const updatedState = { ...location.state, candidates: _.remove(this.state.candidates, c => c.id === candidate.id) };
    this.props.navigate({ ...location, state: updatedState }, { replace: true });
  }


  handleSearch = (searchValue) => {
    this.setState({ searchValue: searchValue });
    axios.get(` ${url.CANDIDATE_API}/candidate/search/${this.state.companyId}?searchValue=${searchValue}`, { headers: authHeader() })
      .then(res => {
        this.setState({
          candidates: res.data.response,
        })
      })
      .catch(error => {
        toastMessage('error', error.response?.data?.message);
      })
  }


  acceptOrReject = (candidate, status) => {
    axios.post(`${url.CANDIDATE_API}/candidate/permit-reject`, { candidateId: candidate.id, status: status }, { headers: authHeader() })
      .then(res => {
        toastMessage('success', res.data.message);
        this.updateState(candidate)
      }).catch((error) => {
        toastMessage('error', error.response?.data?.message);
      });
  }

  toDate = (data) => {
    let date = new Date(data);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dt = date.getDate();

    if (dt < 10) {
      dt = '0' + dt;
    }
    if (month < 10) {
      month = '0' + month;
    }
    return (dt + '/' + month + '/' + year);
  }
  setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME	",
        align: "left",
        renderCell: (params) => {
          return `${params.firstName} ${params.lastName}`;
        },
      },

      {
        name: "EMAIL",
        align: "left",
        key: "email",
      },

      {
        name: "PHONE",
        align: "center",
        key: "phone"
      },
      {
        name: "Last Exam Date",
        align: "center",
        renderCell: (params) => {
          return moment(params).format("DD-MM-YYYY");
        },
      },

      {
        name: "Requested Exam",
        align: "center",
        renderCell: (params) => {
          return moment(params).format("DD-MM-YYYY");
        },
      },
      {
        align: "center",
        renderCell: (params) => (
          isRoleValidation() !== 'HR' ? (
            <div className='row' style={{ position: "relative", left: "3rem" }}>
              <button type='button' className='col-2 btn-prev btn-sm' onClick={() => this.acceptOrReject(params, "ACCEPT")} style={{ marginRight: ".5rem" }}>&#10003; Permit</button>
              <button type='button' className='col-2 btn-nxt btn-sm' onClick={() => this.acceptOrReject(params, "REJECT")}>&#10007; Reject</button>
            </div>
          ) : null
        ),
      }

    ];
    this.setState({ headers: headers });
  };
  render() {
    return (
      <main className="main-content bcg-clr">
        <div>
          <TableHeader
            title="Candidates"
            showLink={false}
          />
          <Search
            title="Filter"
            showSearch={true}
            placeholder="search candidate by name (or) email (or) phone"
            onSearch={this.handleSearch}
          ></Search>

          <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <div className="table-responsive pagination_table">
                  <CustomTable
                    headers={this.state.headers}
                    data={this.state.candidates}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}
export default withLocation(CandidateList);
