import axios from "axios";
import _ from "lodash";
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { authHeader } from "../../api/Api";
import { toastMessage } from "../../utils/CommonUtils";
import { columnsForSignUp } from "../../utils/ReportColumns";
import { url } from "../../utils/UrlConstant";
import DataGridDemo from "./CustomDataGrid";

const ActivityReport = (props) => {
  const [data, setData] = useState([]);
  const [toDate, setToDate] = useState(new Date());
  const [toggleClick, setToggleClick] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [fromDate, setFromDate] = useState('');
  const [duration, setDuration] = useState(props.duration);
  const [type, setType] = useState(props.type);

  useEffect(() => {
    getDateRange();
    getCompanies();
  }, [props]);

  useEffect(() => {
    if (duration !== props.duration || type !== props.type) {
      setDuration(props.duration);
      setType(props.type);
      getDateRange();
    }
  }, [props.duration, props.type]);

  const getDateRange = () => {
    if (duration === 'week') {
      setFromDate(new Date(new Date().setDate(new Date().getDate() - 7)));
    } else if (duration === 'month') {
      setFromDate(new Date(new Date().setDate(new Date().getDate() - 30)));
    } else {
      setFromDate(new Date(new Date().setMonth(new Date().getMonth() - 3)));
    }
  }

  const getReportData = () => {
    axios.get(`${url.ADMIN_API}/dashboard/report/${props.type}?fromDate=${moment(fromDate).format('DD-MM-YYYY')}&toDate=${moment(toDate).format('DD-MM-YYYY')}&page=${currentPage}`, { headers: authHeader() })
      .then(res => {
        let i = 19;
        const withIds = _.map(res.data.response.content, (c) => {
          c.id = 20 * currentPage - (i--);
          return c
        })
        setData(withIds);
        setTotalPages(res.data.response.totalPages);
        setTotalElements(res.data.response.totalElements);
        setNumberOfElements(res.data.response.numberOfElements);
      }).catch(error => {
        toastMessage('error', error.response?.data?.message);
      })
  }

  const getCompanies = () => {
    axios.get(`${url.ADMIN_API}/company/get-company`, { headers: authHeader() })
      .then(res => {
        setCompanies(res.data.response);
      }).catch(error => {
        toastMessage('error', error.response?.data?.message);
      })
  }

  const onPagination = (currentPage) => {
    setCurrentPage(currentPage);
    onNextPage();
  }

  const onNextPage = () => {
    getReportData();
  }

    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginTop: '3rem', flexGrow: '1' }}>
          <DataGridDemo rows={data} columns={columnsForSignUp[type]} onPagination={onPagination} totalSize={totalElements} />
        </div>
      </div>
    )
  }
  export default ActivityReport;

