import React, { Component } from "react";

const Header = ({ title }) => {
  return (
    <header className="position-relative header bg-dark text-light">
      <h1 className="position-fixed top-10 start-50 translate-middle">
        {title}
      </h1>
    </header>
  );
};

export default Header;
