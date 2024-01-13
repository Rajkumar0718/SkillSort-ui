const StatusRadioButton = ({ handleChange, status, style }) => {
  return (
    <>
      <div className="col-3 col-sm-3 col-md-3 col-lg-3">
        <label style={{ padding: "0px" }} className="form-label input-label">
          Status
        </label>
      </div>
      <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
        <div className="d-flex align-items-center ml-3 radio" style={style}>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              id="active"
              type="radio"
              onChange={(e) => handleChange(e, "status")}
              value="ACTIVE"
              name="status"
              checked={status === "ACTIVE" || status === ""}
            />
            <label className="form-check-label" for="active">
              Active
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              id="inactive"
              type="radio"
              onChange={(e) => handleChange(e, "status")}
              value="INACTIVE"
              name="status"
              checked={status === "INACTIVE"}
            />
            <label className="form-check-label" for="inactive">
              Inactive
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default StatusRadioButton;
