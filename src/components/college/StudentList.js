import React from "react";
import { fallBackLoader } from "../../utils/CommonUtils";
import Button from "../../common/Button";
import { Link } from "react-router-dom";
import { useState } from "react";
const StudentList = () => {
  const [loader, setLoader] = useState(true);
  const [openModel, setOpenModel] = useState(false);
  const btnList = [
    {
      type: "button",
      className: "btn btn-sm btn-nxt ml-1 header-button",
      onClick: () => onClickOpenModel(),
      title: "Upload",
      style: {
        marginRight: "15px",
        marginLeft: "5px",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "space-evenly",
        /* align-content: center; */
        alignItems: "center",
      },
    },
  ];
  const addStudentButton = [
    {
      type: "button",
      className: "btn btn-prev btn-sm header-button",
      title: "Add Student",
      linkStyle: { textDecoration: "none", color: "white" },
      to: "/college/add",
    },
  ];

  const onClickOpenModel = () => {
    if (!openModel) {
      document.addEventListener("click", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("click", this.handleOutsideClick, false);
    }
    setOpenModel(!openModel);
  };
  return (
    <main className="main-content bcg-clr">
      <div>
        {fallBackLoader(loader)}
        <div className="card-header-new">
          <span>Student List</span>
          <Button buttonConfig={btnList[0]}>
            <i className="fa fa-upload" aria-hidden="true"></i>
          </Button>
          <Button buttonConfig={addStudentButton[0]} />
        </div>
      </div>
    </main>
  );
};

export default StudentList;
