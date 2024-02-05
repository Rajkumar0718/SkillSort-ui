import axios from "axios";
import React, { Component } from 'react';
import { authHeader, errorHandler } from "../../api/Api";
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import AddSkills from "./AddSkills";
import url from "../../utils/UrlConstant";
import { useState, useEffect } from 'react';

const SkillList = () => {
    const [skills, setSkills] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [modalSection, setModalSection] = useState('');
    const [status, setStatus] = useState('ACTIVE');
    const [sectionRoles, setSectionRoles] = useState('COMPETITOR');
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
  
    useEffect(() => {
      getSectionList();
    }, [status, currentPage, pageSize, sectionRoles]);

    const getSectionList = () => {
        setLoader(true);
        axios.get(`${url.ADMIN_API}/section/list?status=${status}&page=${currentPage}&size=${pageSize}&sectionRoles=${sectionRoles}`, {
            headers: authHeader(),
        })
            .then((res) => {
                setSkills(res.data.response.content);
                setLoader(false);
                setTotalPages(res.data.response.totalPages);
                setTotalElements(res.data.response.totalElements);
                setNumberOfElements(res.data.response.numberOfElements);
            })
            .catch((error) => {
                errorHandler(error);
                setLoader(false);
            });
    }
  
    const handleStatusFilter = (event, key) => {
      setStatus(event.target.value);
      axios
        .get(`${url.ADMIN_API}/section/list?${key}=${event.target.value}&page=${currentPage}&size=${pageSize}&sectionRoles=${sectionRoles}`, {
          headers: authHeader(),
        })
        .then((res) => {
          setSkills(res.data.response.content);
          setTotalPages(res.data.response.totalPages);
          setTotalElements(res.data.response.totalElements);
          setNumberOfElements(res.data.response.numberOfElements);
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
          errorHandler(error);
        });
    };
    const onClickOpenModalAdd = () => {
        if (!openModalAdd) {
          document.addEventListener('click', handleOutsideClick, false);
        } else {
          document.removeEventListener('click', handleOutsideClick, false);
        }
        setOpenModalAdd(!openModalAdd);
      };
    
      const onClickOpenModel = (data) => {
        if (!openModal) {
          document.addEventListener('click', handleOutsideClick, false);
        } else {
          document.removeEventListener('click', handleOutsideClick, false);
        }
        setOpenModal(!openModal);
        setModalSection(data);
      };
    
      const handleOutsideClick = (e) => {
        if (e.target.className === 'modal fade show') {
          if (openModal === true) {
            setOpenModal(!openModal);
            getSectionList();
          } else {
            setOpenModalAdd(!openModalAdd);
            getSectionList();
          }
        }
      };
    
      const onCloseModalAdd = () => {
        setOpenModalAdd(!openModalAdd);
        getSectionList();
      };
    
      const onCloseModal = () => {
        setOpenModal(!openModal);
        getSectionList();
      };
    
      const onNextPage = () => {
        axios
          .get(`${url.ADMIN_API}/section/list/?status=${status}&page=${currentPage}&size=${pageSize}&sectionRoles=${sectionRoles}`, {
            headers: authHeader(),
          })
          .then((res) => {
            setSkills(res.data.response.content);
            setTotalPages(res.data.response.totalPages);
            setTotalElements(res.data.response.totalElements);
            setNumberOfElements(res.data.response.numberOfElements);
            setLoader(false);
          })
          .catch((error) => {
            errorHandler(error);
            setLoader(false);
          });
      };
    
      const increment = (event) => {
        setStartPage(startPage + 5);
        setEndPage(endPage + 5);
      };
    
      const decrement = (event) => {
        setStartPage(startPage - 5);
        setEndPage(endPage - 5);
      };
    
      const onPagination = (pageSize, currentPage) => {
        setPageSize(pageSize);
        setCurrentPage(currentPage);
        onNextPage();
      };

      return (
      <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>Skill List</span>

            <button type="button" onClick={onClickOpenModalAdd} className="btn btn-sm btn-nxt header-button">Add Skill</button>
            {openModalAdd ? (
              <AddSkills
                modalSection={{
                  action: "Add",
                  section: modalSection,
                }}
                onCloseModalAdd={onCloseModalAdd}
              />) : ("")} </div>
          <div className="row">
            <div className="col-md-12">
              <div className="table-border">
                <div>
                  {fallBackLoader(loader)}
                  <div className="table-responsive pagination_table">
                    <table className="table table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>S.No</th>
                          <th>NAME</th>
                          <th>DESCRIPTION</th>
                          <th>
                            <div className="row">
                              <div className="col-sm-6">STATUS</div>
                              <div className="col-sm">
                                <div className="dropdown">
                                  <div className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" > <i className="fa fa-filter" aria-hidden="true"></i> </div>
                                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" >
                                    <option className="dropdown-item" onClick={(e) => handleStatusFilter(e, "status")} value="ACTIVE" > Active </option>
                                    <option className="dropdown-item" onClick={(e) => handleStatusFilter(e, "status")} value="INACTIVE" > InActive </option>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {skills?.length > 0 ? (
                          skills.map((section, index) => {
                            return (
                              <tr>
                                <td>{index + 1}</td>
                                <td>{section.name}</td>
                                <td>{section.description}</td>
                                <td className={section.status === "INACTIVE" ? "text-danger" : "text-success"} > {section.status} </td>
                                <td>
                                  {/* <Link className="collapse-item" to={{ pathname: '/admin/add/section/edit', state:{skills:section,action:'Update'} }}><button type="button" className="btn btn-light"><i className="fa fa-pencil" aria-hidden="true"></i></button></Link> */}
                                  <button
                                    type="button"
                                    onClick={() => onClickOpenModel(section)}
                                    className="btn"
                                  >
                                    <i className="fa fa-pencil" aria-hidden="true" ></i>
                                  </button>
                                  {/* <button type="button" className="btn btn-outline-danger ml-1"><i className="fa fa-trash-o" aria-hidden="true"></i></button> */}
                                </td>
                              </tr>
                            );
                          })) : (<tr className="text-center"> <td colspan="6">No data available in table</td> </tr>)}
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
                  {/* </div> */}
                  {/* </div> */}
                  {this.state.openModal ? (
                    <AddSkills
                      modalSection={{
                        action: "Update",
                        section: modalSection,
                      }}
                      onCloseModal={onCloseModal}
                    />
                  ) : ("")} </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

    export default SkillList;