import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import { fallBackLoader } from "../../utils/CommonUtils";
import { url } from "../../utils/UrlConstant";
import { CustomTable } from "../../utils/CustomTable";

export default class OnGoingExam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onGoingExam: [],
            examIds: [],
            loader: true,
            searchValue: "",
            headers: [],
            currentPage:1,
            pageSize:10

        };
    }

    componentDidMount() {
        this.setTableJson();
        this.initialcall();
    }
    initialcall = () => {
        let user = JSON.parse(localStorage.getItem("user"));
        let id = user.id;
        axios
            .get(
                ` ${url.ADMIN_API}/onGoingExam/list?adminId=${id}&search=${this.state.searchValue}`,
                { headers: authHeader() }
            )
            .then((res) => {
                const temp = res.data.response;
                const examid = this.getKeys(temp);
                this.setState({ onGoingExam: temp, examIds: examid, loader: false });
            })
            .catch((e) => {
                this.setState({ loader: false });
                errorHandler(e);
            });
    };

    getKeys = (data) => {
        //SETTING KEYS IN examIds
        const examid = this.state.examIds;
        let n = Object.keys(data).length;
        for (let i = 0; i < n; i++) {
            examid[i] = Object.keys(data)[i];
        }
        return examid;
    };

    setTableJson = () => {
        const headers = [
            {
                name: 'S.NO',
                align: 'center',
                key: 'S.NO',
            },
            {
                name: 'TEST NAME',
                align: 'left',
                renderCell: (params) => {
                    return params?.name
                }
            },
            {
                name: 'SECTIONS',
                align: 'center',
                renderCell: (params) => {
                    return params?.categories?.length
                }
            },
            {
                name: 'TEST DURATION',
                align: 'left',
                renderCell: (params) => {
                    return params?.duration
                }
            },
            {
                name: 'CANDIDATE COUNT',
                align: 'center',
                renderCell: (params) => {
                    return params?.candidateIds.length
                }
            },

            {
                name: 'CANDIDATE DETAILS',
                align: 'center',
                renderCell: (params) => {
                    return (
                        <Link className="collapse-item" to="/admin/onGoingTest/candidate" state={{ candidateIds: params.candidateIds, }} >
                            <button className="btn btn-sm btn-nxt">
                                View Details
                            </button>
                        </Link>
                    )
                }
            },

        ]
        this.setState({ headers: headers })
    }


    render() {
        return (
            <main className="main-content bcg-clr">
                <div className="card-header-new">
                    <span>OnGoing Test</span>
                </div>
                {/* <div className="row">
          <div className="col-md-12">
            {fallBackLoader(this.state.loader)}
            <div className="table-border">
              <div className="table-responsive pagination_table">
                <table
                  className="table table-striped"
                  style={{ textAlign: "center" }}
                >
                  <thead className="table-dark">
                    <tr>
                      <th>S.No</th>
                      <th style={{ textAlign: "left" }}>Test Name</th>
                      <th>Sections</th>
                      <th>Test Duration</th>
                      <th>Candidate Count</th>
                      <th>Candidate Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(this.state.onGoingExam)?.length > 0 ? (
                      _.map(this.state.examIds, (id, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td style={{ textAlign: "left" }}>
                              {this.state.onGoingExam[id].name}
                            </td>
                            <td>
                              {this.state.onGoingExam[id].categories.length}
                            </td>
                            <td>{this.state.onGoingExam[id].duration}</td>
                            <td>
                              {this.state.onGoingExam[id].candidateIds.length}
                            </td>
                            <td style={{ paddingLeft: "40px" }}>
                              <Link
                                className="collapse-item"
                                to={{
                                  pathname: "/admin/onGoingTest/candidate",
                                  state: {
                                    candidateIds:
                                      this.state.onGoingExam[id].candidateIds,
                                  },
                                }}
                              >
                                <button className="btn btn-info btn-sm">
                                  view details
                                </button>
                              </Link>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="text-center">
                        <td colspan="6">NO ONGOING TEST</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div> */}
                <CustomTable headers={this.state.headers} data={this.state.onGoingExam} pageSize={this.state.pageSize} currentPage={this.state.currentPage} />

            </main>
        );
    }
}
