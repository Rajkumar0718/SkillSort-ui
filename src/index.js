import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'font-awesome/css/font-awesome.min.css';
import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthProvider } from './context/AuthProvider';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  // </StrictMode>
);
