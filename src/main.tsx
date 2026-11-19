import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Desk } from "./components/desk/Desk";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");

createRoot(root).render(
  <StrictMode>
    <Desk />
  </StrictMode>,
);