import React from "react";
import logo from "../assets/logo.png"; 

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" className="logo ms-20" />
    </nav>
  );
};

export default Navbar;
