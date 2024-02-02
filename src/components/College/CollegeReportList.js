import React, { useState } from "react";
import _ from "lodash";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import IconButton from "@mui/material/IconButton";
import StudentPlacementreportModal from "./StudentPlacementreportModal";
import Card from "../../common/Card";
import StudentreportModal from "../SuperAdmin/StudentreportModel";
const CollegeReportList = (props) => {
  const items = [
    {
      name: "Placement Report",
      iconComponent: <BusinessCenterIcon style={{ fontSize: "5rem" }} />,
    },
    {
      name: "Student",
      iconComponent: <SchoolIcon style={{ fontSize: "5rem" }} />,
    },
  ];

  const showModalComponent = (key, onCloseModal) => {
    if (key === "Placement Report") {
      return (
        <StudentPlacementreportModal
          onCloseModal={() => onCloseModal("Placement Report")}
        ></StudentPlacementreportModal>
      );
    } else if (key === "Student") {
      return <StudentreportModal></StudentreportModal>;
    }

    return null;
  };

  const onCloseModalComponent = (name) => {

  };


  return (
    <Card
      items={items}
      showModalComponent={showModalComponent}
      onCloseModalComponent={onCloseModalComponent}
    />
  );
};

export default CollegeReportList;


