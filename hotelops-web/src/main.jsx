import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "@/routes.jsx";
import { BusyProvider } from "@/components/BusyProvider";
import { ToastProvider } from "@/components/ToastProvider";
import "@/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BusyProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </BusyProvider>
  </React.StrictMode>
);
