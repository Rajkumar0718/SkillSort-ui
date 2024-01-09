import React, { useEffect, useState } from 'react';
import Page from '../components/Admin/Page';


const Pagination = (props) => {

  const [, setNumberOfElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [startPage, setStartPage] = useState(1)
  const [endPage, setEndPage] = useState(5)

  useEffect(() => {
    setNumberOfElements(props.numberOfElements)
    setCurrentPage(props.currentPage)
    if(props.currentPage === 1) {
      setStartPage(1)
      setEndPage(5)
    }
    setTotalElements(props.totalElements)
    setTotalPages(props.totalPages)
  }, [props])


  const onNextPage = (page, current) => {
    props.onPagination(page, current);
  }

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    onNextPage(pageSize, pageNumber);
  }

  const increment = () => {
    setStartPage(prevStartPage => prevStartPage + 5);
    setEndPage(prevEndPage => prevEndPage + 5);
  }

  const decrement = () => {
    setStartPage(prevStartPage => prevStartPage - 5);
    setEndPage(prevEndPage => prevEndPage - 5);
  }

  const setFirstPage =() => {
    setStartPage(1);
    setEndPage(5);
  }

  const setLastPage = () => {
    const prevEndPage = Math.floor(totalPages/5) * 5;
    const isPrevPageIsLastPage = prevEndPage===totalPages
    setStartPage(isPrevPageIsLastPage ? prevEndPage - 4 : prevEndPage+1)
    setEndPage(isPrevPageIsLastPage ? totalPages: prevEndPage +5)
  }

  return (
    <div className='row' style={{ overflowX: 'hidden'}}>
      <div className='col'>
        <div className='d-flex justify-content-center' style={{ marginRight: '30px' }}>
          {totalElements > 10 && <ul className="pagination">
            <li className="page-item" style={{ paddingRight: '1.5rem' }}>
              <button onClick={decrement} disabled={startPage <= 5} className="btn-sm btn-prev">
                Previous
              </button>
            </li>
            <Page  totalPages={totalPages} paginate={paginate} startPage={startPage} firstPage= {setFirstPage}
              endPage={endPage} currentPage={currentPage} lastPage = {setLastPage}/>
            <li className="page-item" style={{ paddingLeft: '1.5rem' }}>
              <button onClick={increment} disabled={endPage >= totalPages} className="btn-sm btn-nxt">
                Next
              </button>
            </li>
          </ul>}
        </div>
      </div>
    </div>
  )
}

export default Pagination;