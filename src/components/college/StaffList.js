// import React from "react";
// import { fallBackLoader } from "../../utils/CommonUtils";
// import { useState } from "react";
// import Button from "../../common/Button";
// import { Link } from "react-router-dom";
// import Search from "../../common/AdvanceSearch";
// import axios from 'axios';
// import { url } from "../../utils/UrlConstant";
// import { authHeader ,errorHandler} from "../../api/Api";

// const StaffList = () => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const [staff, setStaff] = useState([]);
//   const [status, setStatus] = useState("ACTIVE");
//   const [loader, setLoader] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalElements, setTotalElements] = useState(0);
//   const [numberOfElements, setNumberOfElements] = useState(0);
//   const [countError, setCountError] = useState(false);
//   const [startPage, setStartPage] = useState(1);
//   const [endPage, setEndPage] = useState(5);
//   const [searchValue, setSearchValue] = useState("");
//   const btnList = [
//     {
//       type: "button",
//       className: "btn btn-sm btn-nxt header-button",
//       title: "Add Coordinator",
//       linkStyle: { textDecoration: "none", color: "white" },
//       to: "/college/placement-coordinator/add",
//     },
//   ];
//   const initialCall = () => {
//     axios
//       .get(
//         `${url.COLLEGE_API}/placement-coordinate/list/?collegeId=${user.companyId}&status=${status}&page=${currentPage}&size=${pageSize}&search=${searchValue}`,
//         {
//           headers: authHeader(),
//         }
//       )
//       .then((res) => {
//         setStaff(res.data.response.content);
//         setLoader(false);
//         setTotalPages(res.data.response.totalPages);
//         setTotalElements(res.data.response.totalElements);
//         setNumberOfElements(res.data.response.numberOfElements);
//       })
//       .catch((error) => {
//         setLoader(false);
//         errorHandler(error);
//       });
//   };

//   const onSearch = (newSearchValue) => {
//     setSearchValue(newSearchValue);
//     setCurrentPage(1);
//     initialCall();
//   };
//   return (
//     <main className="main-content bcg-clr">
//       <div>
//         {fallBackLoader(loader)}
//         <div className="card-header-new">
//           <span>Placement Coordinators</span>
//           <Button buttonConfig={btnList[0]} />
//         </div>
//         <Search
//           title="Filter"
//           showSearch
//           placeholder="search "
//           onSearch={onSearch}
//         ></Search>
//       </div>
//     </main>
//   );
// };

// export default StaffList;
import axios from "axios";
import _ from "lodash";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { authHeader, errorHandler } from "../../api/Api";
import Search from "../../common/AdvanceSearch";
import { fallBackLoader } from "../../utils/CommonUtils";
import Pagination from "../../utils/Pagination";
import { url } from "../../utils/UrlConstant";
import { CustomTable } from "../../utils/CustomTable";
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
export default class StaffList extends Component {
  constructor(props) {
    super(props);
    const user = JSON.parse(localStorage.getItem("user"));
    this.state = {
      staff: [],
      status: "ACTIVE",
      loader: true,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0,
      totalElements: 0,
      numberOfElements: 0,
      countError: false,
      startPage: 1,
      endPage: 5,
      user: user,
      searchValue: "",
    };
  }

  componentDidMount() {
    this.setHeader();
    this.initialcall();
  }

  initialcall = () => {
    axios
      .get(
        ` ${url.COLLEGE_API}/placement-coordinate/list/?collegeId=${this.state.user.companyId}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}&search=${this.state.searchValue}`,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState({
          staff: res.data.response.content,
          loader: false,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };


  handleStatusFilter(value, key) {
    console.log(value);
    this.setState({ searchKey: value });
    axios
      .get(` ${url.COLLEGE_API}/placement-coordinate/list/?collegeId=${this.state.user.companyId}&${key}=${value}&page=${this.state.currentPage}&size=${this.state.pageSize}`, { headers: authHeader() })
      .then(res => {
        this.setState({ staff: res.data.response.content, totalPages: res.data.response.totalPages, totalElements: res.data.response.totalElements, numberOfElements: res.data.response.numberOfElements });
      })
      .catch(error => {
        errorHandler(error);
      })
  }


  onNextPage = () => {
    this.setState({ loader: true });
    axios
      .get(
        ` ${url.COLLEGE_API}/placement-coordinate/list/?collegeId=${this.state.user.companyId}&status=${this.state.status}&page=${this.state.currentPage}&size=${this.state.pageSize}`,
        { headers: authHeader() }
      )
      .then((res) => {
        this.setState({
          staff: res.data.response.content,
          totalPages: res.data.response.totalPages,
          totalElements: res.data.response.totalElements,
          numberOfElements: res.data.response.numberOfElements,
          loader: false,
        });
      })
      .catch((error) => {
        this.setState({ loader: false });
        errorHandler(error);
      });
  };
  increment = (event) => {
    this.setState({
      startPage: this.state.startPage + 5,
      endPage: this.state.endPage + 5,
    });
  };
  decrement = (event) => {
    this.setState({
      startPage: this.state.startPage - 5,
      endPage: this.state.endPage - 5,
    });
  };
  onPagination = (pageSize, currentPage) => {
    this.setState({ pageSize: pageSize, currentPage: currentPage }, () => {
      this.onNextPage();
    });
  };

  onSearch = (searchValue) => {
    this.setState({ searchValue: searchValue }, () => {
      this.initialcall();
    });
  };
  setHeader = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "NAME",
        align: "left",
        key: ["name"],
        concat: true,
      },
      {
        name: "EMAIL",
        align: "left",
        key: "email",
      },
      {
        name: "PHONE NUMBER",
        align: "left",
        key: "phone",
      },

      {
        name: "STATUS",
        align: "left",
        isFilter: true,
        key: "status",
        renderOptions: () => {
          return _.map(
            [
              { name: "Active", value: "ACTIVE" },
              { name: "InActive", value: "INACTIVE" },
            ],
            (opt) => (
              <CustomMenuItem
                onClick={() => this.handleStatusFilter(opt.value,'status')}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </CustomMenuItem>
            )
          );
        },
      },
      {
        name: "ACTION",
        align: "center",
        renderCell: (params) => {
          return (
            <Link
              className="collapse-item"
              state={{ staff: params, action: "Update" }}
              to="/college/placement-coordinator/edit"
            >
              <i
                className="fa fa-pencil"
                aria-hidden="true"
                style={{ color: "black" }}
              ></i>
            </Link>
          );
        },
      },
    ];
    this.setState({ headers });
  };

  render() {
    let i = this.state.pageSize - 1;
    return (
      <main className="main-content bcg-clr">
        <div>
          {fallBackLoader(this.state.loader)}
          <div className="card-header-new">
            <span>Placement Coordinators</span>
            <button type="button" className="btn btn-sm btn-nxt header-button">
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/college/placement-coordinator/add"
              >
                Add Coordinator
              </Link>
            </button>
          </div>
          <Search
            title="Filter"
            showSearch={true}
            placeholder="search "
            onSearch={this.onSearch}
          ></Search>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <CustomTable
                  data={this.state.staff}
                  headers={this.state.headers}
                  loader={this.state.loader}
                  pageSize={this.state.pageSize}
                  currentPage={this.state.currentPage}
                />
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
      </main>
    );
  }
}
