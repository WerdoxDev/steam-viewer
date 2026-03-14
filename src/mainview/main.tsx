import Electrobun from "electrobun";
import { Electroview } from "electrobun/view";

import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { WebviewRPCType } from "../shared/types";
import App from "./App";

const rpc = Electroview.defineRPC<WebviewRPCType>({
   handlers: {
      requests: {},
   },
});

export const electrobun = new Electroview({ rpc });

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <App />
   </StrictMode>,
);
