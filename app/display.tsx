import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { DisplayTab } from "./tabs/DisplayTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="display">
      <DisplayTab />
    </Layout>
  </React.StrictMode>,
);
