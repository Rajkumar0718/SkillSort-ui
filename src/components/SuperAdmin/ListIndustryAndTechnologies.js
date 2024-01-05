import axios from "axios";
import React, { useEffect, useState } from "react";
import { authHeader } from "../../api/Api";
import { fallBackLoader } from "../../utils/CommonUtils";
import _ from 'lodash';
import Pagination from "../../utils/Pagination";
import AddTechnologies from "./AddTechnologies";

const ListIndustryAndTechnologies = () => {
  
  const [sections, setSections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [modalSection, setModalSection] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchData();
  }, [currentPage, endPage]);

  const fetchData = () => {
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
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setOpenModalAdd(!openModalAdd);
  };

  const onClickOpenModel = (data) => {
    if (!openModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setOpenModal(!openModal);
    setModalSection(data);
  };


  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      if (openModal === true) {
        setOpenModal(!openModal);
        fetchData();
      } else {
        setOpenModalAdd(!openModalAdd);
        fetchData();
      }
    }
  };

  const onCloseModalAdd = () => {
    setOpenModalAdd(!openModalAdd);
    fetchData();
  };

  const onCloseModal = () => {
    setOpenModal(!openModal);
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

  const handleStatusFilter = (event) => {
    setStatus(event.target.value);
    getIndustryList();
  };

    let i = pageSize - 1;
    // const paginate = (pageNumber) => this.setState({ currentPage: pageNumber }, () => this.onNextPage());
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
                    <table className="table table-striped" style={{ textAlign: 'left' }}>
                      <thead className="table-dark">
                        <tr>
                          <th style={{ textAlign: 'center' }}>S.No</th>
                          <th>IndustryType</th>
                          <th>Technologies</th>
                          <th>
                            <div className="row">
                              STATUS
                              <div className="col-sm">
                                <div className="dropdown">
                                  <div
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-toggle="dropdown"
                                    aria-haspopup="true"
                                    aria-expanded="false"
                                  >
                                    <i className="fa fa-filter" aria-hidden="true"></i>
                                  </div>
                                  <div
                                    className="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton"
                                  >
                                    <option
                                      className="dropdown-item"
                                      onClick={(e) =>
                                        handleStatusFilter(e)
                                      }
                                      value="ACTIVE"
                                    >
                                      Active
                                    </option>
                                    <option
                                      className="dropdown-item"
                                      onClick={(e) =>
                                        handleStatusFilter(e)
                                      }
                                      value="INACTIVE"
                                    >
                                      InActive
                                    </option>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections?.length > 0 ? (
                          _.map(sections, (section, _index) => {
                            return (
                              <tr>
                                <td style={{ textAlign: 'center' }}>{pageSize * currentPage - (i--)}</td>
                                <td>{section.industryType.name}</td>
                                <td>{section.skillName}</td>
                                <td className={section.status === "INACTIVE" ? "text-danger" : "text-success"} > {section.status} </td>
                                <td>
                                  <i className="fa fa-pencil" aria-hidden="true" onClick={() => onClickOpenModel(section)} style={{ cursor: 'pointer' }}></i>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr className="text-center">
                            <td colspan="6">No data available in table</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
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