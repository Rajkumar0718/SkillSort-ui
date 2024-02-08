import { Box, Grid, Typography } from "@mui/material";
import _ from "lodash";
import React, { useState } from "react";
import { MdUploadFile } from "react-icons/md";
import { Link } from "react-router-dom";
import skillsort from "../assests/images/logo.png";
import ExamMailModel from "../components/Admin/ExamMailModel";
import CopyClipBoardPopUp from "../components/Admin/CopyClipBoardPopUp";
import Divider from '@mui/material/Divider';

const style = {
  backgroundColor: "#9DA3CE",
  height: "22rem",
  width: "16rem",
  marginTop: "1rem",
  borderRadius: "10px",
  display: "flex",


};
function CustomCard({
  view,
  result,
  examId,
  remainingTest,
  positionObject,
  shortListed,
  shortListedCandi,
}) {
  const onClickOpenModel = () => {
    if (!openModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setopenModal(!openModal);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      setopenModal(openModal);
      setopenUrlModal(openUrlModal);
    }
  };

  const onCloseModal = () => {
    setopenModal(!openModal);
  };

  const onClickOpenUrlModel = () => {
    if (!openUrlModal) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
    }
    setopenUrlModal(!openUrlModal);
  };

  const [openModal, setopenModal] = useState(false);
  const [openUrlModal, setopenUrlModal] = useState(false);

  const textDot = (text, maxLength) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  const { name } = positionObject;
  const positionName = textDot(name.toLowerCase(), 20);

  const boxArr = [
    {
      title: "Skillsort Candidates",
      linkTag: (
        <Link aria-hidden="true" title="Skillsort" to={view} state={{position: positionObject}}>
          <img src={skillsort} style={{ height: "23px" ,marginLeft:"8px"}} alt="skillsort"></img>
        </Link>
      ),
      link: (_examId, linkComponent) => getLinkComponent(1, linkComponent),
    },
    {
      title: "Upload Candidates",
      linkTag: (
        <MdUploadFile
          onClick={() => onClickOpenModel()}
          style={{
            color: "#3b489e",
            fontSize: "1.6rem",
            cursor: "pointer",
            marginLeft: "8px",
          }}
          aria-hidden="true"
          title="Send Link"
        />
      ),
      link: (examId, linkComponent) => getLinkComponent(examId, linkComponent),
    },
    {
      title: "View Results",
      linkTag: (
        <Link to={result} state={{position: positionObject}}>
          {" "}
          <i
            className="fa fa-file-text-o"
            aria-hidden="true"
            title="Result"
            style={{
              color: "#3b489e",
              fontSize: "1.4rem",
              marginTop: "4px",
              marginLeft: "12px",
            }}
          ></i>{" "}
        </Link>
      ),
      link: (examId, linkComponent) => getLinkComponent(examId, linkComponent),
    },
    {
      title: "ShortListed Candidate",
      link: (examId, linkComponent) => getLinkComponent(examId, linkComponent),
    },
  ];

  const getLinkComponent = (examId, link) => {
    return examId ? (
      link
    ) : (
      <Typography style={{ fontSize: "small", color: "green" ,marginLeft:"10px"}}>N/A</Typography>
    );
  };

  return (
    <>
      <Box sx={style}>
        <Grid item xs container direction="column">
          <div style={{ display: "flex" }}>
            <span style={{ position: "relative", left: "220px", top: "10px" }}>
              <Link state={{position: positionObject}} to={"/admin/vacancy/edit"}
              >
                <i
                  className="fa fa-edit"
                  aria-hidden="true"
                  title="Edit"
                  style={{ color: "#3b489e", fontSize: "1.3rem" }}
                ></i>
              </Link>
            </span>
            {examId ? (
              <i
                onClick={() => onClickOpenUrlModel()}
                className="fa fa-share-square-o"
                aria-hidden="true"
                title="Public Exam Link"
                style={{
                  color: "#3b489e",
                  fontSize: "1.3rem",
                  position: "relative",
                  top: "10px",
                  cursor: "pointer",
                }}
              ></i>
            ) : null}
          </div>
          <Typography
            variant="h5"
            align="center"
            style={{
              color: "#021172",
              fontFamily: "Baskervville",
              fontSize: "20px",
              textTransform: "capitalize",
            }}
          >
            {positionName}
          </Typography>
          <Typography
            variant="h5"
            align="center"
            style={{
              fontSize: "15px",
              color: "rgb(59, 72, 158)",
              marginTop: "0.5rem",
            }}
          >
            Vacancies : {positionObject.noOfCandidatesRequired}
          </Typography>
          <Divider
            sx={{ backgroundColor: "white", marginTop: "1rem",opacity:'1' }}
            variant="middle"
          />
          {_.map(boxArr, (box, i) => {
            return (
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: "10px",
                  height: "50px",
                  marginTop: i === 0 ? "1rem" : "0.4rem",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  display: "flex",
                  alignItems: "center",
                }}
                key={box.title}
              >
                <Typography
                  style={{
                    fontFamily: "Montserrat",
                    fontSize: "small",
                    marginLeft: "0.5rem",
                    width: i === 0 ? "16.24ch" : "15ch",
                  }}
                >
                  {box.title}
                </Typography>
                <Divider
                  orientation="vertical"
                  variant="middle"
                  flexItem
                  style={{
                    marginTop: "0.8rem",
                    marginLeft: i === 0 ? "1.4rem" : "2rem",
                    marginBottom: "0.8rem",
                    backgroundColor: "black",
                    justifyContent: "space-between",
                    display: "flex",
                    opacity:'1'
                  }}
                />
                {box.title !== "ShortListed Candidate" ? (
                  box?.link(examId, box.linkTag)
                ): (
                  <span style={{marginLeft:"13px"}}>{shortListed || 0}</span>
                )}
              </Box>
            );
          })}
        </Grid>
      </Box>
      {openUrlModal ? <CopyClipBoardPopUp examId={examId} /> : null}
      {openModal ? (
        <ExamMailModel
          modalSection={{
            type: "Email",
            exam: null,
          }}
          onCloseModal={onCloseModal}
          mailModalSection={{ exam: null }}
          remainingTest={remainingTest}
          positionId={positionObject.id}
          examId={examId}
        />
      ) : null}
    </>
  );
}

export default CustomCard;
