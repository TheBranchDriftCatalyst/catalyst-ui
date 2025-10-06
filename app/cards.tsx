import React from "react";
import ReactDOM from "react-dom/client";
import { Layout } from "./shared/Layout";
import { CardsTab } from "./tabs/CardsTab";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout currentPage="cards">
      <CardsTab />
    </Layout>
  </React.StrictMode>,
);
