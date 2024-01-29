import React, { Component } from "react";
import { CustomTable } from "../../utils/CustomTable";
import { MenuItem } from "@mui/material";
import _ from "lodash";
import { Link } from "react-router-dom";
import TableHeader from "../../utils/TableHeader";
import axios from "axios";
import url from "../../utils/UrlConstant";
import { authHeader, errorHandler } from "../../api/Api";
import Pagination from "../../utils/Pagination";
import moment from "moment";
import AdvSearch from "../../common/Search";

export default class VacancyHistory extends Component {
  constructor() {
    super();
    this.state = {
      positions: [],
      name: "",
      status: "ACTIVE",
      loader: true,
      currentPage: 1,
      openModal: false,
      pageSize: 10,
      totalPages: 0,
      fromDate: "",
      toDate: "",
      totalElements: 0,
      numberOfElements: 0,
      startPage: 1,
      endPage: 5,
    };
  }
  componentDidMount() {
    this.getAllVacancies();
  }

  getDate = (date) => {
    if (moment(date).isValid()) return moment(date).format("DD-MM-YYYY");
    else if (this.state.toDate) return moment().format("DD-MM-YYYY");
    return "";
  };

  getAllVacancies = () => {
    this.setState({ loader: true });
    axios
      .get(
        `${url.ADMIN_API}/position/history?page=${
          this.state.currentPage
        }&size=${this.state.pageSize}&status=${this.state.status}&search=${
          this.state.name
        }&&fromDate=${this.getDate(this.state.fromDate)}&toDate=${
          moment(this.state.toDate).isValid()
            ? moment(this.state.toDate).format("DD-MM-YYYY")
            : moment().format("DD-MM-YYYY")
        }`,
        {
          headers: authHeader(),
        }
      )
      .then((res) => {
        let response = res.data.response;
        this.setState(
          {
            positions: response.content,
            loader: false,
            totalPages: response.totalPages,
            totalElements: response.totalElements,
            numberOfElements: response.numberOfElements,
          },
          this.setTableJson
        );
      })
      .catch((error) => {
        errorHandler(error);
        this.setState({ loader: false });
      });
  };

  handleStatusFilters = (value) =>
    this.setState({ status: value, currentPage: 1 }, this.getAllVacancies);

  setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: "Vacancy Name",
        align: "left",
        key: "name",
      },
      {
        name: "No. of Vacancy required",
        align: "left",
        key: "noOfCandidatesRequired",
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
              <MenuItem
                onClick={() => this.handleStatusFilters(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            )
          );
        },
      },
      {
        name: "Action",
        key: "action",
        renderCell: (params) => {
          return (
            <Link
              state={{ position: params }}
              className="collapse-item"
              to={"/admin/vacancy/edit"}
            >
              <i
                className="fa fa-pencil"
                style={{ cursor: "pointer", color: "#3B489E" }}
                aria-hidden="true"
              ></i>
            </Link>
          );
        },
      },
    ];
    this.setState({ headers: headers });
  };

  onPagination = (pageSize, currentPage) => {
    this.setState(
      { pageSize: pageSize, currentPage: currentPage },
      this.getAllVacancies
    );
  };

  onSearch = (value, fromDate, toDate) => {
    this.setState(
      { name: value, currentPage: 1, fromDate: fromDate, toDate: toDate },
      this.getAllVacancies
    );
  };

  render() {
    return (
      <div>
        <TableHeader title="Vacancy-History" />
        <AdvSearch
          title="Filter"
          showSearch={true}
          showDate={true}
          placeholder="search by vacancy name"
          onSearch={this.onSearch}
        />
        <CustomTable
          data={this.state.positions}
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
            numberOfElements={this.state.numberOfElements}
            totalElements={this.state.totalElements}
            pageSize={this.state.pageSize}
          />
        )}
      </div>
    );
  }
}
