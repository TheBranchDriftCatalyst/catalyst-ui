import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Initialize react-scan (development only)
if (import.meta.env.DEV) {
  import("react-scan").then(mod => {
    mod.scan({
      enabled: true,
      log: false, // Set to true to log all renders
    });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
