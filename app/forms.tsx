import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { FormsTab } from "./tabs/FormsTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="forms">
      <FormsTab />
    </Layout>
  </React.StrictMode>,
);
