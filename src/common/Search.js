import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/system/Unstable_Grid";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from '@mui/icons-material/Search';
import {
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
const AdvSearch = (props) => {
  const title = props.title;
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const onSearch = () => {
    props.onSearch(search, fromDate, toDate);
  };

  const onChange = (event) => {
    setSearch(event.target.value);
  };
  return (
    <Paper
      elevation={2}
      sx={{
        padding: 2,
        marginBottom: "1rem",
        height: "58px",
        backgroundColor: "rgba(59, 72, 158, 0.3)",
        width: "100%",
        boxShadow: 2,
      }}
    >
      <Grid container spacing={2} style={{ justifyContent: "space-between" }}>
        <Grid
          item
          xs={2}
          lg={2}
          md={2}
          sx={{
            maxWidth: "6.5rem",
            height: "2.5rem",
            borderRight: "1px solid #3B489E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span className="title">{title}</span>
        </Grid>
        {props.showDate ? (
          <>
            <Grid item xs={2} lg={2} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiDatePicker
                  value={fromDate === "" ? null : fromDate}
                  onChange={(date) => setFromDate(date)}
                  format="dd/MM/yyyy"
                  slotProps={{
                    popper:{
                      placement:'auto'
                    },
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
                    field: { clearable: true, onClear: () => setFromDate("") },
                  }}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={2} lg={2} md={2}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <MuiDatePicker
                  value={toDate === "" ? null : toDate}
                  onChange={(date) => setToDate(date)}
                  format="dd/MM/yyyy"
                  minDate={fromDate || null}
                  slotProps={{
                    popper: {
                      placement: 'auto',
                      modifiers: [
                        {
                          name: 'flip',
                          enabled: true,
                          options: {
                            fallbackPlacements: ['top', 'bottom'], // Specify the fallback placements
                          },
                        },
                      ],
                    },
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
                    field: { clearable: true, onClear: () => setToDate("") },
                  }}
                />
              </LocalizationProvider>
            </Grid>
          </>
        ) : (
          <Grid item xs={4} lg={4} md={4} />
        )}
        {props.showSearch ? (
          <>
            <Grid item xs={4} lg={3} md={3} xl={3}>
              <TextField
                sx={{
                  float: "right",
                  backgroundColor: "white",
                  borderRadius: "5px",
                  width: props.showDate ? "16rem" : "26rem",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon
                        sx={{ color: "#aaa", paddingLeft: "5px" }}
                      />
                    </InputAdornment>
                  ),
                  sx: { fontSize: "13px" },
                }}
                placeholder={props.placeholder}
                onChange={onChange}
                onKeyDown={(e) => (e.key === "Enter" ? onSearch() : "")}
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
            </Grid>
          </>
        ) : (
          <Grid item xs={5} md={5} lg={5}></Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default AdvSearch;
