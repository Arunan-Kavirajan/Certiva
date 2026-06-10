import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import { CertificateProvider } from "./context/CertificateContext";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <CertificateProvider>
      <App />
    </CertificateProvider>
  </React.StrictMode>
);