import React from "react";
import { Link } from "react-router-dom";

const Button = ({ buttonConfig, children }) => {
  const {
    className,
    onClick,
    style,
    type,
    dataToggle,
    dataPlacement,
    hoverTitle,
    disabled,
    dataDismiss,
    id,
    to,
    linkStyle,
    title,
    linkClassname,
  } = buttonConfig;

  return (
    <button
      className={className}
      onClick={onClick}
      style={style}
      type={type}
      data-toggle={dataToggle}
      data-placement={dataPlacement}
      title={hoverTitle}
      disabled={disabled}
      data-dismiss={dataDismiss}
      id={id}
    >
      {to ? (
        <Link style={linkStyle} to={to} className={linkClassname}>
          {title}
        </Link>
      ) : (
        title
      )}
      {children}
    </button>
  );
};

export default Button;