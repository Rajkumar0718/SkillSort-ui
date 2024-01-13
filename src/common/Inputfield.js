import React from 'react';
import FormHelperText from "@mui/material/FormHelperText";
const InputField = ({ label, error, errorMessage, onChange, value, name, type, placeholder }) => (
  <div className="row" >
    <div className="col-3 col-sm-3 col-md-3 col-lg-3">
      <label className="form-label input-label" htmlFor="inputSection">
        {label}<span className="required"></span>
        <FormHelperText className="helper" style={{ paddingLeft: "0px" }}>
          {error ? errorMessage : null}
        </FormHelperText>
      </label>
    </div>
    <div className="col-9 col-sm-9 col-md-9 col-lg-9 col-xl-9">
      <input
        className="profile-page"
        onChange={(e) => onChange(e, name)}
        value={value}
        autoComplete="off"
        name={name}
        id={name}
        maxLength="50"
        type={type}
        placeholder={placeholder}
      />
    </div>
  </div>
);

export default InputField;
