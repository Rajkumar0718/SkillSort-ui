import { Grid, InputAdornment, styled, TextField, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';
import './style.css';

const AdvSearch = (props) => {
 const title = props.title;
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
  <Paper sx={{ padding: 2, marginBottom: '1rem', height: '58px', backgroundColor: 'rgba(59, 72, 158, 0.3)', marginLeft: '0.1rem', width: '100%' }} elevation={2}>
     <Grid container spacing={2} style={{ justifyContent: 'space-between' }}>
       <Grid item xs={2} lg={2} md={2} style={{
         maxWidth: "6.5rem",
         height: "3.5rem",
         borderRight: "1px solid #3B489E",
         display: "flex",
         alignItems: "flex-start",
         justifyContent: "center",
         paddingTop:"23px",
       }}>
         <span className="title">{title}</span>
       </Grid>
       {
         props.showDate ?
           <>
           <Grid item xs={2} lg={2} md={2}>
               {/* <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  style={{ backgroundColor: '#fff', borderRadius: '3px' }}
                  id="date-picker-dialog"
                  format="dd/MM/yyyy"
                  autoComplete='off'
                  placeholder='From Date'
                  value={fromDate === "" ? null : fromDate}
                  onChange={date => setFromDate(date)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
               </MuiPickersUtilsProvider>
             </Grid>
             <Grid item xs={2} lg={2} md={2}>

               <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  style={{ backgroundColor: '#fff', borderRadius: '3px' }}
                  id="date-picker-dialog"
                  format="dd/MM/yyyy"
                  autoComplete='off'
                  placeholder='To Date'
                  value={toDate === "" ? null : toDate}
                  onChange={date => setToDate(date)}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
               </MuiPickersUtilsProvider> */}
             </Grid>
           </> : <Grid item xs={4} lg={4} md={4}/>
       }

       {props.showSearch ? <>
         <Grid item xs={4} lg={3} md={3} xl={3}>
           <TextField
             style={{ float: 'right', backgroundColor: 'white', borderRadius: '5px', width: props.showDate ? '16rem': '26rem' }}
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
   </Paper>
 );
}

export default AdvSearch;
