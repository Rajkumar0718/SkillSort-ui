import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import './style.css';
import DatePick from './DatePick';
import StyledPaper from './StyledPaper';


import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const AdvSearch = (props) => {
    const title = props.title;
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

 const onSearch = () => {
   props.onSearch(search, fromDate, toDate);
 }
  const title = props.title;
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const onSearch = () => {
    props.onSearch(search, fromDate, toDate);
  };

    const onChange = (event) => {
        setSearch(event.target.value);
    }

    return (
        <StyledPaper elevation={2}>
            <Grid container spacing={2} style={{ justifyContent: 'space-between' }}>
                <Grid item xs={2} lg={2} md={2} style={{
                    maxWidth: "6.5rem",
                    height: "2.5rem",
                    borderRight: "1px solid #3B489E",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <span className="title">{title}</span>
                </Grid>
                {
                    props.showDate ?
                        <>
                            <Grid item xs={2} lg={2} md={2}>
                                <DatePick
                                    className='profile-page'
                                    style={{ border: 'none' }}
                                    views={["year"]}
                                    value={fromDate === "" ? null : fromDate}
                                    inputProps={{
                                        style: { padding: '0px', paddingBottom: '0.2rem', fontSize: '13px', color: 'black', fontWeight: '500', fontFamily: 'Montserrat' },
                                    }}
                                    onChange={date => setFromDate(date)}
                                />
                            </Grid>
                            <Grid item xs={2} lg={2} md={2}>

                                <DatePick
                                    className='profile-page'
                                    style={{ border: 'none' }}
                                    views={["year"]}
                                    value={fromDate === "" ? null : fromDate}
                                    inputProps={{
                                        style: { padding: '0px', paddingBottom: '0.2rem', fontSize: '13px', color: 'black', fontWeight: '500', fontFamily: 'Montserrat' },
                                    }}
                                    onChange={date => setFromDate(date)}
                                />
                            </Grid>
                        </> : <Grid item xs={4} lg={4} md={4} />
                }

                {props.showSearch ? <>
                    <Grid item xs={4} lg={3} md={3} xl={3}>
                        <TextField
                            style={{ float: 'right', backgroundColor: 'white', borderRadius: '5px', width: props.showDate ? '16rem' : '26rem' }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" >
                                        <SearchIcon style={{ color: '#aaa', paddingLeft: '5px' }} />
                                    </InputAdornment>
                                ),
                                style: { fontSize: '13px' },
                                autoComplete: 'new-password'
                            }}
                            placeholder={props.placeholder}
                            onChange={onChange}
                            onKeyDown={(e) => e.key === 'Enter' ? onSearch() : ""}
                            variant="standard"
                        />

                    </Grid>
                    <Grid item xs={1}>
                        <button
                            className="btn btn-sm btn-prev pull-right m-0"
                            style={{ marginTop: "5px" }}
                            onClick={onSearch}
                        >
                            search
                        </button>
                    </Grid></>
                    : <Grid item xs={5} md={5} lg={5}></Grid>}
            </Grid>
        </StyledPaper>
    );
}

export default AdvSearch;
