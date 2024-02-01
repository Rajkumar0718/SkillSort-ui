import React from "react";

const Input = (props) => {
  const {
    className = "",
    placeholder = "",
    type = "",
    onChange,
    name = "",
    style = {},
    value = "",
    autoComplete = "off",
    id = "",
    checked,
    maxLength,
  } = props;

  return (
    <input
      className={className}
      placeholder={placeholder}
      type={type}
      onChange={onChange}
      name={name}
      style={style}
      value={value}
      autoComplete={autoComplete}
      id={id}
      checked={checked}
      maxLength={maxLength}
    />
  );
};
export default Input;