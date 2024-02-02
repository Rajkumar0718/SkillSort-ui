import React from "react";
import { fallBackLoader } from "../../utils/CommonUtils";
import { useState } from "react";
import Button from "../../common/Button";
import { Link } from "react-router-dom";
const StaffList = () => {
  const [loader, setLoader] = useState(true);
  const btnList = [
    {
      type: "button",
      className: "btn btn-sm btn-nxt header-button",
      title: "Add Coordinator",
      linkStyle: { textDecoration: "none", color: "white" },
      to:"/college/placement-coordinator/add"
    },
  ];
  return (
    <main className="main-content bcg-clr">
      <div>
        {fallBackLoader(loader)}
        <div className="card-header-new">
          {" "}
          <span>Placement Coordinators</span>
          <Button buttonConfig={btnList[0]} />
        </div>
      </div>
    </main>
  );
};

export default StaffList;
