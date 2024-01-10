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
      value={props.value}
      autoComplete={props.autoComplete}
      id={props.id}
      maxLength={props.maxLength}
    />
  );
};

export default Input;
