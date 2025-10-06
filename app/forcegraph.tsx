import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { ForceGraphTab } from "./tabs/ForceGraphTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="forcegraph">
      <ForceGraphTab />
    </Layout>
  </React.StrictMode>,
);
