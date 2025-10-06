import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { ComponentsTab } from "./tabs/ComponentsTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="components">
      <ComponentsTab />
    </Layout>
  </React.StrictMode>,
);
