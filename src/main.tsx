import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./global.css";
import { ConfigProvider } from "antd";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#f759ab",
        },
      }}
    >
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
