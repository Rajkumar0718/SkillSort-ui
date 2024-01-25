import axios from 'axios';
import _ from 'lodash';
import moment from "moment";
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from '../../api/Api';
import Pagination from '../../utils/Pagination';
import { url } from '../../utils/UrlConstant';
import { withLocation } from '../../utils/CommonUtils';
import { CustomTable } from '../../utils/CustomTable';
class CandidateDetailsOnGoingExam extends Component {

  constructor(props) {
    super(props);
    this.state = {
      candidateIds: [],
      candidates: [],
      searchValue: '',
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
      headers:[],
    }
  }

  componentDidMount() {
    this.setTableJson();
    const { candidateIds } = this.props.location.state;
    axios.get(`${url.ADMIN_API}/candidate/search?candidateIds=${candidateIds}&searchValue=${this.state.searchValue}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({ candidateIds: candidateIds, candidates: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements })
      })
      .catch(error => {
        errorHandler(error);
      })
  }
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => { this.onNextPage() });
  }

  increment = (event) => {
    this.setState({
      startPage: (this.state.startPage) + 5,
      endPage: (this.state.endPage) + 5
    });
  }
  decrement = (event) => {
    this.setState({
      startPage: (this.state.startPage) - 5,
      endPage: (this.state.endPage) - 5
    });
  }

  onNextPage = () => {
    axios.get(`${url.ADMIN_API}/candidate/search?candidateIds=${this.state.candidateIds}&searchValue=${this.state.searchValue}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({ candidates: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements })
      }).catch(error => {
        errorHandler(error);
      })
  }

  renderTable = () => {
    return _.map(this.state.candidates, (candidate, index) => {
      return (
        <tr>
          <td>{index + 1}</td>
          <td>{candidate.firstName + " " + candidate.lastName}</td>
          <td>{candidate.email}</td>
          <td>{candidate.phone}</td>
          <td>{moment(candidate.dob).format('DD-MM-YYYY')}</td>
          <td>{candidate.gender}</td>
          <td>{candidate.qualification}</td>
        </tr>);
    })
  }
  setTableJson = () => {
    const headers = [
        {
            name: 'S.NO',
            align: 'center',
            key: 'S.NO',
        },
        { 
            name: 'NAME',
            align: 'left',
            renderCell: (params) => {
                console.log(params);
                return params?.firstName + " " + params?.lastName 
            }
        },
        {
            name: 'Email',
            align: 'left',
            renderCell: (params) => {
                return params?.email
            }
        },
        {
            name: 'Mobile',
            align: 'left',
            renderCell: (params) => {
                return params?.phone
            }
        },
        {
            name: 'Date of birth',
            align: 'left',
            renderCell: (params) => {
                return moment(params?.dob).format("DD/MM/YYYY")
            }
        },
        {
            name: 'Gender',
            align: 'left',
            renderCell: (params) => {
                return params?.gender
            }
        },
        {
            name: 'Qualification',
            align: 'center',
            renderCell: (params) => {
                return params?.qualification
            }
        },
    ]
    this.setState({ headers: headers })
}

  render() {
    // let i = this.state.pageSize - 1;
    // const paginate = (pageNumber) => this.setState({ currentPage: pageNumber }, () => this.onNextPage());
    return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Candidate List</span>
            <Link to='/admin/onGoingTest'>
              <button type="button" className="btn btn-sm btn-nxt header-button">BACK</button>
            </Link>
          </div>
          {/* <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <div className="card-body">
                  <div className="table-responsive pagination_table">
                    <table className="table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>S.No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Mobile</th>
                          <th>Date of birth</th>
                          <th>Gender</th>
                          <th>Qualification</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderTable()}
                      </tbody>
                    </table>
                    {this.state.numberOfElements === 0 ? (
                      ""
                    ) : (
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
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          <CustomTable headers={this.state.headers} data={this.state.candidates} pageSize={this.state.pageSize} currentPage={this.state.currentPage}/>
        </div>
      </main>
    );
  }
}

export default  withLocation(CandidateDetailsOnGoingExam)