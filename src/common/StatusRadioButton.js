const StatusRadioButton = ({ handleChange,status, style }) => {
  return (
    <div className="d-flex align-items-center ml-3 radio" style={style}>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          id="active"
          type="radio"
          onChange={(e) => handleChange(e, "status")}
          value="ACTIVE"
          name="status"
          checked={ status === "ACTIVE" || status === "" }
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
          checked={ status === "INACTIVE"}
        />
        <label className="form-check-label" for="inactive">
          Inactive
        </label>
      </div>
    </div>
  );
};

export default StatusRadioButton;
