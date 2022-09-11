import React, { Component } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/navBar";
import Home from "./components/home";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

class App extends Component {
  state = {};
  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </React.Fragment>
    );
  }
}

export default App;
