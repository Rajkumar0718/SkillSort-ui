import React, { useState } from 'react'
import url  from '../../utils/UrlConstant'

export default function SelectTech(props) {
  const [selectedTech, setSelectTech] = useState('')
  // const history = useHistory();

  const setTech = (e) => {
    setSelectTech(e.target.value)
  }

  const setTechnologyInLocalStorage = () => {
    localStorage.setItem('technology', selectedTech)
    window.close()
    // isRoleValidation() === 'COLLEGE_STUDENT' ? history.push('/student/student-test') : history.push('/competitor/testList')
    window.open(`${url.UI_URL}/candidateinstruction`, "", "width=1450px,height=900px")
  }

  return (
    <div className='row can-page' style={{ height: '100%' }}>
      <header className="can-header">
        <span className="can-instruction" style={{marginLeft:'8rem'}}>
          Candidate Instruction
        </span>
      </header>
      <div className="container instruction-container">
        <div className="row can-section">
          <div className="col">
            Select the technology would you like to take the test?<span className="required"></span>
          </div>
          <div className="col">
            <select style={{ color: '#3B489E' }}
              value={selectedTech}
              onChange={(e) => setTech(e)}
              className="form-select section"
            >
              <option value="">Select Technology</option>
              <option value="PROGRAMMING">Programming</option>
              <option value="DBMS">DBMS</option>
              {/* <option value="BOTH">BOTH</option> */}
            </select>
          </div>
        </div>
      </div>
      <footer className="btn start-test">
        <button disabled={!selectedTech} className="btn btn-info" style={{ padding: '3px 0px 0px 0px',cursor: selectedTech ? 'pointer' :'not-allowed' }} onClick={() => setTechnologyInLocalStorage(selectedTech)}> Next</button>
      </footer>

    </div>
  )
}