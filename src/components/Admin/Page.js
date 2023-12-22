import _ from 'lodash';
import React from 'react';

const Page = ({ totalPages, paginate, currentPage, startPage, endPage, firstPage, lastPage }) => {
    let pageNumbers = [];
    const length = endPage - (startPage - 1);
    pageNumbers = Array.from({ length }, (_, i) => startPage + i);
    const showForwardIcon = currentPage!==totalPages;
    const showBackwardIcon = currentPage !== 1;

    const setPageToFirst = () => {
        firstPage()
        paginate(1)
    }

    const setLastPage = () => {
        lastPage()
        paginate(totalPages)
    }

    return (
        <>
            <li style={{ margin: '0.45rem 2rem 0.45rem 0.45rem', cursor: showBackwardIcon ? 'pointer' : 'not-allowed', opacity: showBackwardIcon ? '1' : '0.38' }} onClick={() => setPageToFirst()}>
                <i data-toggle="tooltip" data-placement="top" title="Jump Firstpage" class="fa fa-backward" aria-hidden="true"></i>
            </li>
            {_.map(pageNumbers, number => {
                return (number <= totalPages) ? (<li style={{ zIndex: '0' }} className={currentPage === (number) ? 'page-item active' : 'page-item'}>
                    <div onClick={() => paginate(number)} className="page-link" href="#"> {number} </div> </li>) : ""
            })}
           <li style={{ margin: '0.45rem 0.45rem 0.45rem 1.45rem', cursor: showForwardIcon? 'pointer' : 'not-allowed',opacity: showForwardIcon ? '1': '0.38' }} onClick={() => setLastPage(totalPages)}><i data-toggle="tooltip" data-placement="top" title="Jump Lastpage" class="fa fa-forward" aria-hidden="true"></i></li>
        </>
    )
}
export default Page;