import React from "react";

const Label = (props) => {
  return (
    <label
      className={props.className}
      htmlFor={props.htmlFor}
      style={props.style}
    >
      {props.children}
    </label>
  );
};

export default Label;
