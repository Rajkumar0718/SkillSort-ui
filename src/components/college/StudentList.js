import React, { useState } from "react";
import Button from "../../common/Button";
import { fallBackLoader } from "../../utils/CommonUtils";


const StudentList = () => {
  const [loader, setLoader] = useState(false);
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

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal fade show") {
      // getStudents();
    }
  };

  const onClickOpenModel = () => {
    if (!openModel) {
      document.addEventListener("click", handleOutsideClick, false);
    } else {
      document.removeEventListener("click", handleOutsideClick, false);
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
