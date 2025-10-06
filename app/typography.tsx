import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { TypographyTab } from "./tabs/TypographyTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="typography">
      <TypographyTab />
    </Layout>
  </React.StrictMode>,
);
