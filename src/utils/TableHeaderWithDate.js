import DateFnsUtils from "@date-io/date-fns";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const TableHeaderWithDate = (props) => {
  const title = props.title;
  const link = props.link;
  const buttonName = props.buttonName;
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const onSearch = () => {
    props.onSearch(search, fromDate, toDate);
  }

  const onChange = (event) => {
    setSearch(event.target.value);
  }

  return (
    <div className="search">
      <div
        className="row"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
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
        {
          props.showDate ?
            <>
              <div className='col-lg-2 col-sm-1 col-md-1 col-xs-1 col-2'>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiDatePicker
                  value={fromDate === "" ? null : fromDate}
                  onChange={(date) => setFromDate(date)}
                  format="dd/MM/yyyy"
                  slotProps={{
                    textField: {
                      variant: "filled",
                      size: "small",

                      sx: {
                        borderRadius: "3rem",

                        "& .MuiInputBase-input": {
                          backgroundColor: "white",
                          paddingTop: "0px !important",
                          height: "2rem",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "currentcolor",
                        },
                        "& .MuiInputBase-root": {
                          width: "12rem",
                          background: "white",
                        },
                      },
                      className: "profile-page",
                      placeholder: "From Date",
                    },
                  }}
                />
              </LocalizationProvider>
              </div>
              <div className='col-lg-2 col-sm-1 col-md-1 col-xs-2 col-2'>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiDatePicker
                  value={toDate === "" ? null : toDate}
                  onChange={(date) => setToDate(date)}
                  format="dd/MM/yyyy"
                  minDate={fromDate || null}
                  slotProps={{
                    textField: {
                      variant: "filled",
                      size: "small",

                      sx: {
                        borderRadius: "3rem",

                        "& .MuiInputBase-input": {
                          backgroundColor: "white",
                          paddingTop: "0px !important",
                          height: "2rem",
                        },
                        "& .MuiSvgIcon-root": {
                          color: "currentcolor",
                        },
                        "& .MuiInputBase-root": {
                          width: "12rem",
                          background: "white",
                        },
                      },
                      className: "profile-page",
                      placeholder: "To Date",
                    },
                  }}
                />
              </LocalizationProvider>
              </div>
            </> : <></>
        }
        {
          props.showSearch ?
            <>
              <div className="col-md-3 col-lg-4 col-sm-2">
                <input type="text" className="form-control" placeholder={props.placeholder} onChange={onChange} onKeyDown={(e) => e.key === 'Enter' ? onSearch() : ""}/>
              </div>
              <div className="col-md-2">
                <button className="btn btn-sm btn-prev pull-right" style={{ marginTop: "5px" }} onClick={onSearch}>search</button>
              </div>
            </> :
            <div className="col-md-5 col-lg-5 col-sm-5">
            </div>}
        {props.showLink ?
          <div className="col-md-1 col-lg-1 col-sm-1">
            <Link to={link} className="btn btn-sm btn-primary float-right" style={{ marginTop: "5px" }}>{buttonName}</Link>
          </div> : ""}
      </div>
    </div>
  )
}

export default TableHeaderWithDate;
