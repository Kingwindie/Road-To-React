import React from "react";

const Button = ({ onclick, className = "", children }) => (
  <button onclick={onclick} className={className} type="button">
    {children}
  </button>
);

export default Button;
