import React, { useState } from "react";
import _ from "lodash";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import StudentPlacementreportModal from "./StudentPlacementreportModal";
import Card from "../../common/Card";
import StudentreportModal from "../SuperAdmin/StudentreportModel";
const CollegeReportList = (props) => {
  const [collegeId, setCollegeId] = useState((JSON.parse(localStorage.getItem("user")) || {}).companyId);
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
          collegeId={collegeId}
        />
      );
    } else if (key === "Student") {
      return <StudentreportModal onCloseModal={() => onCloseModal("Student")} collegeId={collegeId}/>;
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

