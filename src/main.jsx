import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toggle/style.css" // for ES6 modules
import 'react-tooltip/dist/react-tooltip.css'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ShowProvider } from "./context/ShowContext.jsx";
import MedicinesProvider from "./context/MedicinesContext.jsx";
import PatientProvider from "./context/PatientsContext.jsx";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ShowProvider>
      <AuthProvider>
        <MedicinesProvider>
        <PatientProvider>
          <App />
        </PatientProvider>
        </MedicinesProvider>
      </AuthProvider>
      </ShowProvider>
    </BrowserRouter>
    <ToastContainer
        position="bottom-center"
        hideProgressBar
        className="mb-2"
        rtl={true}
        style={{zIndex: 999999}}
      />
  </React.StrictMode>
);
