import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { TokensTab } from "./tabs/TokensTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="tokens">
      <TokensTab />
    </Layout>
  </React.StrictMode>,
);
