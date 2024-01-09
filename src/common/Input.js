import React from "react";

const Input = (props) => {
  return (
    <input
      className={props.className}
      placeholder={props.placeholder}
      type={props.type}
      onChange={props.handleChange}
      name={props.name}
      style={props.style}
    />
  );
};

export default Input;
