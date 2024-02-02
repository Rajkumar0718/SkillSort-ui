import { MenuItem } from "@mui/material";
import axios from 'axios';
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authHeader, errorHandler } from '../../api/Api';
import AdvSearch from "../../common/Search";
import { CustomTable } from "../../utils/CustomTable";
import Pagination from "../../utils/Pagination";
import TableHeader from "../../utils/TableHeader";
import { url } from '../../utils/UrlConstant';


const PracticeExam = () => {
  const [practiceExam, setPracticeExam] = useState([]);
  const [name, setName] = useState("");
  const [searchName, setSearchName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    practiceExamList();
  }, [currentPage, pageSize, status, searchName]);

  const setTableJson = () => {
    const headers = [
      {
        name: "S.NO",
        align: "center",
        key: "S.NO",
      },
      {
        name: " Name",
        align: "left",
        key: "name",
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
                onClick={() => handleStatusFilters(opt.value)}
                key={opt.value}
                value={opt.value}
              >
                {opt.name}
              </MenuItem>
            )
          );
        },
      }, {
        name: " Display Order",
        align: "center",
        key: "displayOrder",
      },
      {
        name: "Action",
        key: "action",
        renderCell: (params) => {
          return (
            <Link
            className="collapse-item"
            to="/settings/practiceExam/viewPracticeExam"
              state={{practiceExam: params}}
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
    setHeaders(headers);
  };

  const handleStatusFilters = (value) => {
    setStatus(value);
    setCurrentPage(1);
    practiceExamList();
  };



  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
    practiceExamList();
  };

  const onSearch = (value) => {
    setSearchName(value);
    handleFilter();
  };

  const handleFilter = () => {
    axios.get(`${url.COLLEGE_API}/practiceExam/search?name=${searchName}&page=${currentPage}&size=${pageSize}&status=${status}`, { headers: authHeader() })
      .then(res => {
        setPracticeExam(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
      })
      .catch(error => {
        errorHandler(error);
        setLoader(false);
      });
  };

  const practiceExamList = () => {
    axios.get(`${url.COLLEGE_API}/practiceExam/get?page=${currentPage}&size=${pageSize}&status=${status}`, { headers: authHeader() })
      .then(res => {
        let response = res.data.response;
        setPracticeExam(response.content);
        setLoader(false);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setNumberOfElements(response.numberOfElements);
        setTableJson();
      })
      .catch((error) => {
        errorHandler(error);
        setLoader(false);
      });
  };

  return (
    <>

      <div className="card-header-new">
        <Link to='/settings/practiceExam/addPracticeExam'>  <button type="button" className="btn btn-sm btn-nxt header-button">Add Practice Exam</button></Link>
        <div>
          <TableHeader title="PracticeExam-History" />
          <AdvSearch
            title="Filter"
            showSearch={true}
            placeholder="search by Exam name"
            onSearch={onSearch}
          />
          <CustomTable
            data={practiceExam}
            headers={headers}
            loader={loader}
            pageSize={pageSize}
            currentPage={currentPage}

          />
          {numberOfElements === 0 ? (
            ""
          ) : (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPagination={onPagination}
              numberOfElements={numberOfElements}
              totalElements={totalElements}
              pageSize={pageSize}
            />
          )}

        </div>
      </div>
    </>
  )
}

export default PracticeExam;

