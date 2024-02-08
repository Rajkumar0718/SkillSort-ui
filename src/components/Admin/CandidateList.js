import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { authHeader } from "../../api/Api";
import Search from '../../common/AdvanceSearch';
import { toastMessage, withLocation } from '../../utils/CommonUtils';
import TableHeader from '../../utils/TableHeader';
import url  from '../../utils/UrlConstant';
import { isRoleValidation } from '../../utils/Validation';
import '../Candidate/Styles.css'
class CandidateList extends Component {

  constructor(props) {
    const company = JSON.parse(localStorage.getItem('user'))
    super(props);
    console.log(this.props.location?.state?.candidates)
    this.state = {
      searchValue: '',
      candidates: this.props.location?.state?.candidates || [],
      companyId: company.companyId,
    }
  }

  updateState = (candidate) => {
    const { history, location } = this.props;
    const updatedState = { ...location.state, candidates: _.remove(this.state.candidates,c=>c.id === candidate.id)};
    history.replace({ ...location, state: updatedState });
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


  renderTable = () => {
    return this.state.candidates?.length > 0 ? _.map(this.state.candidates, (candidate, index) => {
      return (
        <tr>
          <td style={{textAlign: 'center'}}>{index + 1}</td>
          <td style={{ textTransform: 'capitalize', textAlign: 'left' }}>{candidate.firstName} {candidate.lastName}</td>
          <td style={{ textAlign: 'left' }}>{candidate.email}</td>
          <td>{candidate.phone}</td>
          <td>{this.toDate(candidate.lastExamDate)}</td>
          <td>{candidate.requestedExamName}</td>
          {isRoleValidation() !== 'HR' ? <td>
            <div className='row'>
                <button type='button' className='col-2 btn-prev btn-sm' onClick={() => this.acceptOrReject(candidate, "ACCEPT")} style={{marginRight:".5rem"}}>&#10003; Permit</button>
                <button type='button' className='col-2 btn-nxt btn-sm' onClick={() => this.acceptOrReject(candidate, "REJECT")}>&#10007; Reject</button>
            </div>
          </td> : ''}
        </tr>
      );
    }) : <tr className='text-center'><td colspan="7">NO DATA AVAILABLE</td></tr>
  }

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
                  <table className="table table-striped">
                    <thead className="table-dark-custom">
                      <tr>
                        <th style={{textAlign: 'center'}}>S.No</th>
                        <th style={{ textAlign: 'left' }}>Name</th>
                        <th style={{ textAlign: 'left' }}>Email</th>
                        <th>Mobile</th>
                        <th>Last Exam Date</th>
                        <th>Requested Exam</th>
                        {isRoleValidation() !== "HR" ? <th></th> : ""}
                      </tr>
                    </thead>
                    <tbody>{this.renderTable()}</tbody>
                  </table>
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
