import React from "react";

const Button = (props) => {
console.log(props.title);
  return (
    <div>
      <button
        className={props.className}
        onClick={props.onClick}
        style={props.style}
        type={props.type}
        data-toggle={props.dataToggle}
        data-placement={props.dataPlacement}
        title={props.hoverTitle}
        disabled={props.disabled}
        data-dismiss={props.dataDismiss}
        id={props.id}
      >{props.title}</button>
    </div>
  );
};

export default Button;

