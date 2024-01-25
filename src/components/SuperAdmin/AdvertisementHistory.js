import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment/moment';
import { authHeader, errorHandler } from '../../api/Api';
import { fallBackLoader } from '../../utils/CommonUtils';
import Pagination from '../../utils/Pagination';
import { url } from '../../utils/UrlConstant';
import { CustomTable } from '../../utils/CustomTable';

const AdvertisementHistory = () => {
  const [ads, setAds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [numberOfElements, setNumberOfElements] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(5);
  const [loader, setLoader] = useState(false);
  const [headers, setHeaders] = useState([]);


  useEffect(() => {
    getAdvertisements();
  }, [currentPage, pageSize]);

  const getAdvertisements = () => {
    setLoader(true);
    setTableJson();
    axios
      .get(`${url.ADV_API}/advdetails?page=${currentPage}&size=${pageSize}`, { headers: authHeader() })
      .then((res) => {
        setAds(res.data.response.content);
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

  const onPagination = (pageSize, currentPage) => {
    setPageSize(pageSize);
    setCurrentPage(currentPage);
    getAdvertisements();
  };

  const deleteAd = (data) => {
    axios
      .post(`${url.ADV_API}/advdetails/remove`, data, { headers: authHeader() })
      .then((res) => {
        if (totalElements % 10 === 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        }
        getAdvertisements();
      })
      .catch((error) => {
        errorHandler(error);
      });
  };

  let i = pageSize - 1

  const setTableJson = () => {
    const newHeaders = [
      {
        name: 'S.NO',
        align: 'center',
        key: 'S.NO',
      },
      {
        name: 'COMPANY NAME',
        align: 'left',
        key: 'companyName',
      },
      {
        name: 'START DATE',
        align: 'left',
        key: 'startDate',
      },
      {
        name: 'END DATE',
        align: 'left',
        key: 'endDate',
      },
      {
        name: 'DISPLAY ORDER',
        align: 'left',
        key: 'displayOrder',
      },
      {
        name: 'Action',
        key: 'action',
        renderCell: (params) => (
          <>
            <Link className="collapse-item" to='/skillsortadmin/advertisement/edit' state= {{ ads: params, action: 'Update' }}>
              <i className='fa fa-pencil' style={{ cursor: 'pointer', color: '#3B489E' }} aria-hidden='true'></i>
            </Link>
            {/* Uncomment this line if needed */}
            {/* <i className="fa fa-trash-o" aria-hidden="true" title='Delete' onClick={() => deleteAd(params)} style={{ marginLeft: '1rem', color: '#3B489E', cursor: 'pointer' }}></i> */}
          </>
        ),
      },
    ];
    setHeaders(newHeaders);
  };

  return (
    <main className="main-content bcg-clr">
      <div>
        <div className="card-header-new">
          <span>Advertisements</span>
          <button type="button" className="btn btn-sm btn-nxt header-button">
            <Link
              style={{ textDecoration: "none", color: "white" }}
              to='/skillsortadmin/advertisement/add'
            >
              Add Advertisement
            </Link>
          </button>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table-border">
              <div>
                {fallBackLoader(loader)}
                <div className="table-responsive pagination_table">
                  <CustomTable
                    headers={headers}
                    data={ads}
                    loader={loader}
                    pageSize={pageSize}
                    currentPage={currentPage}
                  />
                  {/* <table className="table table-striped" id="dataTable">
                    <thead className="table-dark" style={{ textAlign: 'center' }}>
                      <tr>
                        <th>S.No</th>
                        <th style={{ textAlign: 'left' }}>Company Name</th>
                        <th style={{ textAlign: 'left' }}>Start Date</th>
                        <th style={{ textAlign: 'left' }}>End Date</th>
                        <th style={{ textAlign: 'left' }}>Display Order</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody style={{ textAlign: 'center' }}>
                      {ads?.length > 0 ? (
                        ads.map((ad, index) => {
                          return (
                            <tr key={ad.id}>
                              <td>{pageSize * currentPage - (i--)}</td>
                              <td style={{ textAlign: 'left', textTransform: 'capitalize' }}>{ad.companyName}</td>
                              <td style={{ textAlign: 'left' }}>{moment(ad.startDate).format('DD-MM-YYYY')}</td>
                              <td style={{ textAlign: 'left' }}>{moment(ad.endDate).format('DD-MM-YYYY')}</td>
                              <td style={{ textAlign: 'left' }}>{ad.displayOrder}</td>
                              <td>
                                <Link className="collapse-item" to={{ pathname: '/skillsortadmin/advertisement/edit', state: { ads: ad, action: 'Update' } }}>
                                  <i className="fa fa-pencil" aria-hidden="true"></i>
                                </Link>
                                <i className="fa fa-trash-o" aria-hidden="true" title='Delete' onClick={() => deleteAd(ad)} style={{ marginLeft: '1rem', color: '#3B489E', cursor: 'pointer' }}></i>
                              </td>
                            </tr>
                          );
                        })) : (<tr className="text-center"> <td colspan="8">No data available in table</td> </tr>)}
                    </tbody>
                  </table> */}
                  {numberOfElements === 0 ? '' :
                    <Pagination
                      totalPages={totalPages}
                      currentPage={currentPage}
                      onPagination={onPagination}
                      startPage={startPage}
                      numberOfElements={numberOfElements}
                      endPage={endPage}
                      totalElements={totalElements}
                      pageSize={pageSize}

                    />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default AdvertisementHistory;