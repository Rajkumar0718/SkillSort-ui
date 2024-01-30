import { Checkbox, InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import './style.css';


function Search(props) {
  const title = props.title;
  console.log(props, "props");
  const [search, setSearch] = useState('');

  const onSearch = () => {
    props.onSearch(search);
  }

  const onChange = (event) => {
    setSearch(event.target.value);
  }

  return (
      <div className="search" style={props.style}>
        <div
          className="col-md-2 col-lg-2 col-sm-2 col-xl-2 p-0"
          style={{
            maxWidth: "6.5rem",
            height: "2.5rem",
            borderRight: "1px solid #3B489E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="title">{title}</span>
        </div>
        {props.showSearch ? (
          <>

            <div className="form-group has-search mb-0" style={{ marginLeft: props.showCheckBox ? '28%' : '41%', width: '35%' }}>
              {/* <i className="fa fa-search form-control-feedback"></i>
               <input type="text" className="form-control col-lg-12"  placeholder={props.placeholder} onChange={onChange}
                  style={{
                    fontFamily: "Montserrat",
                    fontStyle: "normal",
                    fontSize: "13px",

                  }}
                /> */}
              <TextField
                sx={{
                  float: 'right',
                  backgroundColor: 'white',
                  borderRadius: '5px',
                  width: '26rem'
                }}
                //  style={{float:'right',backgroundColor:'white',borderRadius:'5px',width:'26rem'}}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" >
                      <SearchIcon style={{ color: '#aaa', paddingLeft: '5px' }} />
                    </InputAdornment>
                  ),
                  style: { fontSize: '13px' }
                }}
                placeholder={props.placeholder}
                onChange={onChange}
                onKeyDown={(e) => e.key === 'Enter' ? onSearch() : ""}
                variant="standard"
              />
            </div>
            {props.showCheckBox &&
              <div className='col-md-2 col-lg-2 col-sm-2 col-xl-2 p-0 '>
                <span className="title" >Trial Companies <Checkbox onChange={() => props.handleTrailCompany()} ></Checkbox></span>
              </div>}
            <div className="col-md-1 col-lg-1 col-sm-1 col-xl-1 p-0 ">
              <button
                className="btn btn-sm btn-prev pull-right m-0"
                style={{ marginTop: "5px" }}
                onClick={onSearch}
              >
                search
              </button>
            </div>
          </>
        ) : (
          <div className="col-md-5 col-lg-5 col-sm-5 col-xl-5"></div>
        )}
      </div>
  );
}

export default Search;
