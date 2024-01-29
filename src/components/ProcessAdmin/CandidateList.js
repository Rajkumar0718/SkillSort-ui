import React from 'react'

const CandidateList = () => {
    const [state, setState] = useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0,
        first: [],
        numberOfElements: 0,
        startPage: 1,
        endPage: 5,
        candidate: {},
        examName: '',
        examId: '',
        openModel: false,
        result: {},
        loader: true,
        toDate: '',
        fromDate: '',
        searchValue: ''
      });
      const [openModel, setOpenModel] = useState(false);
      const [searchValue, setSearchValue] = useState('');
      const [fromDate, setFromDate] = useState('');
      const [toDate, setToDate] = useState('');
      const [pageSize, setPageSize] = useState(10);
      const [currentPage, setCurrentPage] = useState(1);
    
      useEffect(() => {
        getSkillSortCandidates();
      }, [currentPage, pageSize, fromDate, toDate, searchValue]);
    
      const getSkillSortCandidates = () => {
        axios.get(`${url.ADMIN_API}/superadmin/selected?examId=${localStorage.getItem("examId")}&page=${currentPage}&size=${pageSize}&status=NOTIFIED_TO_SKILL_SORT&fromDate=${(fromDate !== '' && fromDate) ? moment(fromDate).format('DD/MM/YYYY') : ''}&toDate=${(toDate !== '' && toDate) ? moment(toDate).format('DD/MM/YYYY') : ''}&searchValue=${searchValue}`, { headers: authHeader() })
          .then(res => {
            setState(prevState => ({
              ...prevState,
              candidate: res.data.response.content,
              totalPages: res.data.response.totalPages,
              totalElements: res.data.response.totalElements,
              numberOfElements: res.data.response.numberOfElements,
              examName: localStorage.getItem("examName"),
              examId: localStorage.getItem("examId"),
              loader: false
            }));
          })
          .catch(error => {
            setState(prevState => ({ ...prevState, loader: false }));
            errorHandler(error);
          });
      };
    
      const onNextPage = () => {
        setState(prevState => ({ ...prevState, loader: true }));
        getSkillSortCandidates();
      };

      const increment = () => {
        setState(prevState => ({
          startPage: prevState.startPage + 5,
          endPage: prevState.endPage + 5,
        }));
      };
    
      const decrement = () => {
        setState(prevState => ({
          startPage: prevState.startPage - 5,
          endPage: prevState.endPage - 5,
        }));
      };
      const FBModel = (data, openModel, handleOutSideClick, setModelOpen, setResult) => {
        useEffect(() => {
          if (!openModel) {
            document.addEventListener("click", handleOutSideClick, true);
          } else {
            document.removeEventListener("click", handleOutSideClick, false);
          }
      
          return () => {
            document.removeEventListener("click", handleOutSideClick, false);
          };
        }, [openModel, handleOutSideClick]);
      
        setModelOpen(!openModel);
        setResult(data);
      };
      const handleOutSideClick = (e) => {
        if (e.target.className === "modal fade show") {
          setOpenModel((prevOpenModel) => !prevOpenModel);
          // Additional logic if needed, e.g., getSkillSortCandidates();
        }
      };
    
      const onCloseModal = () => {
        setOpenModel(false);
        // Additional logic if needed, e.g., getSkillSortCandidates();
      };
    
      const onSearch = (value, fromDate, toDate) => {
        setSearchValue(value);
        setFromDate(fromDate);
        setToDate(toDate);
        // Additional logic if needed, e.g., getSkillSortCandidates();
      };
    
      const onPagination = (size, page) => {
        setPageSize(size);
        setCurrentPage(page);
        // Additional logic if needed, e.g., onNextPage();
      };
    
      const setFontColor = (status) => {
        if (status === 'ASSIGNED TO PANELIST') return '#17a2b8';
        if (status === 'FEEDBACK RECEIVED') return '#ffc107';
        if (status === 'FEEDBACK FORWARDED') return 'green';
        return ''; // Add a default case if needed
      };
  return (
    <div>CandidateList</div>
  )
}

export default CandidateList