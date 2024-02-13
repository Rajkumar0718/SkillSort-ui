import axios from "axios";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../api/Api";
import { fallBackLoader } from "../../utils/CommonUtils";
import _ from 'lodash';
import Pagination from "../../utils/Pagination";
import AddTechnologies from "./AddTechnologies";
import { MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { CustomTable } from "../../utils/CustomTable";




const ListIndustryAndTechnologies = () => {

  const [sections, setSections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [modalSection, setModalSection] = useState('');
  const [status, setStatus] = useState('ACTIVE');
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    fetchData();
  }, [currentPage, endPage]);

  const fetchData = () => {
    setTableJson();
    axios
      .get(`/api1/skillset/list?page=${currentPage}&size=${endPage}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setSections(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const onClickOpenModalAdd = () => {
    if (!openModalAdd) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModalAdd((prev) => !prev);
  };

  const onClickOpenModel = (data) => {
    if (!openModal) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModal((prev) => !prev);
    setModalSection(data);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      if (openModal) {
        setOpenModal((prev) => !prev);
      } else {
        setOpenModalAdd((prev) => !prev);
      }
      fetchData();
    }
  };

  const onCloseModalAdd = () => {
    setOpenModalAdd((prev) => !prev);
    fetchData();
  };

  const onCloseModal = () => {
    setOpenModal((prev) => !prev);
    fetchData();
  };

  const increment = () => {
    setStartPage(startPage + 5);
    setEndPage(endPage + 5);
  };

  const decrement = () => {
    setStartPage(startPage - 5);
    setEndPage(endPage - 5);
  };

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
    onNextPage();
  };

  const onNextPage = () => {
    axios
      .get(`/api1/skillset/list?page=${currentPage}&size=${pageSize}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setSections(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      });
  };

  const onSearch = (searchValue) => {
    setSearchValue(searchValue);
    getIndustryList();
  };

  const getIndustryList = () => {
    axios
      .get(
        `/api1/skillset/industrylist?page=${currentPage}&size=${endPage}&status=${status}&search=${searchValue}`,
        { headers: authHeader() }
      )
      .then((res) => {
        setSections(res.data.response.content);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
        setLoader(false);
      });
  };

  const handleStatusFilter = (value) => {
    setStatus(value);
    getIndustryList();
  };

  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'INDUSTRYTYPE',
        align: 'left',
        renderCell:(params) => params?.industryType? params.industryType?.name :"-"
      },
      {
        name: 'TECHNOLOGIES',
        align: 'left',
        renderCell:(params) => params?.industryType? params.skillName :"-"
      },
      {
        name: 'STATUS',
        align: 'left',
        isFilter: true,
        key: 'status',
        renderOptions: () => {
          return _.map(
            [
              { name: 'Active', value: 'ACTIVE' },
              { name: 'InActive', value: 'INACTIVE' },
            ],
            (opt) => (
              <MenuItem
                onClick={() => handleStatusFilter(opt.value)}
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
        name: 'Action',
        key: 'action',
        renderCell: (params) => {
          return (
            <Link
              // className='collapse-item'
              // to='/settings'
              // state={{ position: params ,action: 'Update' }}

            >
              <i
                className='fa fa-pencil'
                style={{ cursor: 'pointer', color: '#212529' }}
                aria-hidden='true'
                onClick={() => onClickOpenModel(params)}
              ></i>
            </Link>
          );
        },
      },
    ];
    setHeaders(newHeaders);
  };

  let i = pageSize - 1;

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="card-header-new">
          <span>Technologies</span>
          <button type="button" onClick={onClickOpenModalAdd} className="btn btn-sm btn-nxt header-button">Add Technology</button>
          {openModalAdd ? (
            <AddTechnologies
              modalSection={{
                action: "Add",
                section: modalSection,
              }}
              onCloseModalAdd={onCloseModalAdd}
            />
          ) : (
            ""
          )}
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-border">
              <div>
                {fallBackLoader(loader)}
                <div className="table-responsive pagination_table">
                  <CustomTable headers={headers} data={sections} pageSize={pageSize} currentPage={currentPage} link={"/settings"}></CustomTable>
                  {numberOfElements === 0 ? '' :
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPagination={onPagination}
                      increment={increment}
                      decrement={decrement}
                      startPage={startPage}
                      numberOfElements={numberOfElements}
                      endPage={endPage}
                      totalElements={totalElements}
                      pageSize={pageSize}

                    />}
                </div>
                {openModal ? (
                  <AddTechnologies
                    modalSection={{
                      action: "Update",
                      section: modalSection,
                    }}
                    onCloseModal={onCloseModal}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default ListIndustryAndTechnologies;