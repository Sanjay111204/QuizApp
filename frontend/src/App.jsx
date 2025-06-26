import React from "react";
import Base from "./components/Base";
import Homepage from "./components/homepage";
import Demo from "./components/demo";
import { ToastContainer } from "react-toastify";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
const App = () => {
  return (
    <div>
      <Base />
      <ToastContainer />
    </div>
  );
};

export default App;
