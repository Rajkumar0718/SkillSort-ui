import axios from "axios";
import _ from "lodash";
import React, { Component,useState ,useRef ,useEffect } from "react";
import { authHeader, errorHandler } from "../../api/Api";
import { CustomTable } from "../../utils/CustomTable";
import Pagination from "../../utils/Pagination";
import SectionModal from "./AddSectionModal";
import CustomMenuItem from "../../utils/Menu/CustomMenuItem";
import url from "../../utils/UrlConstant";
const SectionList = () => {
  const [sections, setSections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [modalSection, setModalSection] = useState('');
  const [status, setStatus] = useState('ACTIVE');
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

    axios
      .get(`${url.ADMIN_API}/section/list?status=${status}&page=${currentPage}&size=${pageSize}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setSections(res.data.response.content);
        setLoader(false);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      })
      .catch((error) => {
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
          return _.map([{ name: 'Active', value: 'ACTIVE' }, { name: 'InActive', value: 'INACTIVE' }], (opt) => (
            <CustomMenuItem onClick={() => handleStatusFilter(opt.value, 'status')} key={opt.value} value={opt.value}>
              {opt.name}
            </CustomMenuItem>
          ));
        },
      },
      {
        name: 'ACTION',
        align: 'center',
        renderCell: (params) => (
          <i
            className="fa fa-pencil"
            style={{ cursor: 'pointer', color: '#3B489E' }}
            aria-hidden="true"
            onClick={() => onClickOpenModel(params)}
          ></i>
        ),
      },
    ];

    setHeaders(newHeaders);
  };

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
    onNextPage();
  };

  const handleStatusFilter = (value, key) => {
    setStatus(value);

    axios
      .get(`${url.ADMIN_API}/section/list?${key}=${value}&page=${currentPage}&size=${pageSize}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setLoader(false);
        setSections(res.data.response.content);
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
    if (!openModalAdd) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModalAdd(true);
  };

  const onClickOpenModel = (data) => {
    if (!openModal) {
      document.addEventListener('click', handleOutsideClick, false);
    } else {
      document.removeEventListener('click', handleOutsideClick, false);
    }
    setOpenModal(true);
    setModalSection(data);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal fade show') {
      if (openModal) {
        setOpenModal(false);
        initialCall();
      } else {
        setOpenModalAdd(false);
        initialCall();
      }
    }
  };

  const onCloseModalAdd = () => {
    setOpenModalAdd(false);
    initialCall();
  };

  const onCloseModal = () => {
    setOpenModal(false);
    initialCall();
  };

  const onNextPage = () => {
    axios
      .get(`${url.ADMIN_API}/section/list/?&status=${status}&page=${currentPage}&size=${pageSize}`, {
        headers: authHeader(),
      })
      .then((res) => {
        setSections(res.data.response.content);
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

  const increment = (_event) => {
    setStartPage((prevStartPage) => prevStartPage + 5);
    setEndPage((prevEndPage) => prevEndPage + 5);
  };

  const decrement = (_event) => {
    setStartPage((prevStartPage) => prevStartPage - 5);
    setEndPage((prevEndPage) => prevEndPage - 5);
  };

  return (
    <main className="main-content bcg-clr">
    <div>
      <div className="card-header-new">
        <span>Sections</span>
        <button type="button" onClick={onClickOpenModalAdd} className="btn btn-nxt btn-sm header-button" style={{position:'relative', left:'1rem'}}>Add Section</button>
        {openModalAdd ? (
          <SectionModal modalSection={{ action: "Add", section: modalSection, }} onCloseModalAdd={onCloseModalAdd} />
        ) : ("")}
      </div>
      <CustomTable data={sections}
        headers={headers}
        loader={loader}
        pageSize = {pageSize}
        currentPage = {currentPage}
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
        <SectionModal
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
  </main>
  )
}

export default SectionList