import React, { useState } from "react";
import _ from "lodash";
import IconButton from "@mui/material/IconButton";

const ReportList = (props) => {
  const { items, showModalComponent, onCloseModalComponent } = props;
  const [loader, setLoader] = useState(false);
  const [modalKey, setModalKey] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = (key) => {
    setModalKey(key);
    setShowModal(true);
    showModalComponent(key);
  };

  const onCloseModal = (key) => {
    setModalKey(null);
    setShowModal(false);
    onCloseModalComponent(key);
  };

  return (
    <div className="row" style={{ justifyContent: "center" }}>
      {_.map(items, (item, idx) => (
        <div
          key={idx}
          className="col-12 col-lg-4 col-sm-6 col-xl-2 col-md-4 d-flex"
          style={{ flexDirection: "column" }}
        >
          <div
            className="home"
            style={{
              backgroundColor: idx % 2 === 0 ? "#3B489E" : "#F05A28",
              textAlign: "center",
            }}
          >
            <IconButton
              onClick={() => openModal(item.name)}
              style={{
                color: "#FFFFFF",
                fontSize: "5rem",
                cursor: "pointer",
                marginTop: "2.3rem",
              }}
            >
              {item.iconComponent}
            </IconButton>
          </div>
          <div
            onClick={() => openModal(item.name)}
            style={{ textAlign: "center", cursor: "pointer" }}
            className="dash-text"
          >
            {item.name}
          </div>
        </div>
      ))}
      {showModal ? showModalComponent(modalKey, onCloseModal) : null}
    </div>
  );
};

export default ReportList;
