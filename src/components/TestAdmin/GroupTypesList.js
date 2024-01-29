import axios from 'axios'
import React, { Component, useEffect, useState } from 'react'
import { url } from '../../utils/UrlConstant'
import { authHeader, errorHandler } from '../../api/Api'
import AddSectionModal from './AddSectionModal'
import Pagination from '../../utils/Pagination'
import { CustomTable } from '../../utils/CustomTable'
import CustomMenuItem from '../../utils/Menu/CustomMenuItem'
import _ from 'lodash'
import { toastMessage } from '../../utils/CommonUtils'

const GroupTypesList = () => {
    const [groupTypes, setGroupTypes] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [modalSection, setModalSection] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [loader, setLoader] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [numberOfElements, setNumberOfElements] = useState(0);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(5);
    const [headers, setHeaders] = useState([]);
  
    useEffect(() => {
      initialCall();
    }, [currentPage, pageSize, status]);
  
    const initialCall = () => {
      setHeader();
      setLoader(true);
      axios.get(`${url.COLLEGE_API}/practiceExam/getGroupTypeStatus?status=${status}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
        .then(res => {
          setGroupTypes(res.data.response.content);
          setLoader(false);
          setTotalPages(res.data.response.totalPages);
          setTotalElements(res.data.response.totalElements);
          setNumberOfElements(res.data.response.numberOfElements);
        })
        .catch(error => {
          setLoader(false);
          errorHandler(error);
        });
    };
  
    const setHeader = () => {
      const newHeaders = [
        { name: 'S.NO', align: 'center', key: 'S.NO' },
        { name: 'NAME', align: 'left', key: 'name' },
        { name: 'DESCRIPTION', align: 'left', key: 'description' },
        {
          name: 'STATUS',
          align: 'left',
          isFilter: true,
          key: 'status',
          renderOptions: () => {
            return _.map([{ name: 'Active', value: 'ACTIVE' }, { name: 'InActive', value: 'INACTIVE' }], opt => (
              <CustomMenuItem onClick={() => handleStatusFilter(opt.value, 'status')} key={opt.value} value={opt.value}>{opt.name}</CustomMenuItem>
            ));
          },
        },
        {
          name: "ACTION",
          align: 'center',
          renderCell: (params) => (
            <div>
              <i className="fa fa-pencil" style={{ cursor: 'pointer', color: '#3B489E' }} aria-hidden="true" onClick={() => onClickOpenModel(params)}></i>
              <i className="fa fa-trash-o" aria-hidden="true" title='Delete Test' onClick={() => deleteGroupType(params.id)} style={{ marginLeft: '1rem', color: '#3B489E' }}></i>
            </div>
          ),
        },
      ];
  
      setHeaders(newHeaders);
    };
  
    const onPagination = (newPageSize, newCurrentPage) => {
      setPageSize(newPageSize);
      setCurrentPage(newCurrentPage);
      onNextPage();
    };
  
    const handleStatusFilter = (value, key) => {
      setStatus(value);
      axios
        .get(`${url.COLLEGE_API}/practiceExam/getGroupTypeStatus?${key}=${value}&page=${currentPage}&size=${pageSize}`, {
          headers: authHeader(),
        })
        .then((res) => {
          setLoader(false);
          setGroupTypes(res.data.response.content);
          setTotalPages(res.data.response.totalPages);
          setTotalElements(res.data.response.totalElements);
          setNumberOfElements(res.data.response.numberOfElements);
        })
        .catch((error) => {
          setLoader(false);
          errorHandler(error);
        });
    };
  
    const onClickOpenModalAdd = () => {
      const handleOutsideClick = (e) => {
        if (e.target.className === "modal fade show") {
          if (openModal === true) {
            setOpenModal(!openModal);
            initialCall();
          } else {
            setOpenModalAdd(!openModalAdd);
            initialCall();
          }
        }
      };
  
      if (!openModalAdd) {
        document.addEventListener('click', handleOutsideClick, false);
      } else {
        document.removeEventListener('click', handleOutsideClick, false);
      }
  
      setOpenModalAdd(!openModalAdd);
    };
  
    const onClickOpenModel = (data) => {
      const handleOutsideClick = (e) => {
        if (e.target.className === "modal fade show") {
          if (openModal === true) {
            setOpenModal(!openModal);
            initialCall();
          } else {
            setOpenModalAdd(!openModalAdd);
            initialCall();
          }
        }
      };
  
      if (!openModal) {
        document.addEventListener("click", handleOutsideClick, false);
      } else {
        document.removeEventListener("click", handleOutsideClick, false);
      }
  
      setOpenModal(!openModal);
      setModalSection(data);
    };
  
    const onCloseModalAdd = () => {
      setOpenModalAdd(!openModalAdd);
      initialCall();
    };
  
    const onCloseModal = () => {
      setOpenModal(!openModal);
      initialCall();
    };
  
    const handleOutsideClick = (e) => {
      if (e.target.className === "modal fade show") {
        if (openModal === true) {
          setOpenModal(!openModal);
          initialCall();
        } else {
          setOpenModalAdd(!openModalAdd);
          initialCall();
        }
      }
    };
  
    const onNextPage = () => {
      axios.get(` ${url.COLLEGE_API}/practiceExam/getGroupTypeStatus/?&status=${status}&page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
        .then(res => {
          setGroupTypes(res.data.response.content);
          setTotalPages(res.data.response.totalPages);
          setTotalElements(res.data.response.totalElements);
          setNumberOfElements(res.data.response.numberOfElements);
          setLoader(false);
        }).catch(error => {
          setLoader(false);
          errorHandler(error);
        });
    };
  
    const increment = (_event) => {
      setStartPage((prevStartPage) => prevStartPage + 5);
      setEndPage((prevEndPage) => prevEndPage + 5);
    };
  
    const decrement = (_event) => {
      setStartPage((prevStartPage) => prevStartPage - 5);
      setEndPage((prevEndPage) => prevEndPage - 5);
    };
  
    const deleteGroupType = (id) => {
      axios.delete(`${url.COLLEGE_API}/practiceExam/group/delete?id=${id}`, { headers: authHeader() })
        .then(_res => {
          toastMessage('success', 'Test Deleted Successfully..!');
          initialCall();
        }).catch(error => {
          errorHandler(error);
        });
    };

  return (
    <main className="main-content bcg-clr">
        <div>
          <div className="card-header-new">
            <span>GroupTypes</span>
            <button type="button" onClick={onClickOpenModalAdd} className="btn btn-nxt btn-sm header-button">Add GroupTypes</button>
            {openModalAdd ? <AddSectionModal type={'Group'} modalSection={{ action: 'Add',groupTypes:modalSection, }} onCloseModalAdd={onCloseModalAdd} /> : ''}
          </div>
          <CustomTable data={groupTypes}
            headers={headers}
            loader={loader}
            pageSize={pageSize}
            currentPage={currentPage}
          />
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
          {openModal ? (
            <AddSectionModal
            type={'Group'}
              modalSection={{
                action: "Update",
                groupTypes:modalSection
              }}
              onCloseModal={onCloseModal}
            />
          ) : (
            ""
          )}
        </div>
      </main>
  )
}

export default GroupTypesList