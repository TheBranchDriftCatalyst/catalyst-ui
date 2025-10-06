import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { AnimationsTab } from "./tabs/AnimationsTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="animations">
      <AnimationsTab />
    </Layout>
  </React.StrictMode>,
);
