import React from "react";

const Label = (props) => {
  const { className = "", htmlFor = "", style = {},children } = props;
  return (
    <label className={className} htmlFor={htmlFor} style={style}>
      {children}
    </label>
  );
};

export default Label;
