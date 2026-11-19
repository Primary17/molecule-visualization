import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/literata/cyrillic-500.css";
import "@fontsource/literata/cyrillic-500-italic.css";
import "@fontsource/literata/cyrillic-600.css";
import "@fontsource/literata/cyrillic-ext-500.css";
import "@fontsource/literata/cyrillic-ext-500-italic.css";
import "@fontsource/literata/cyrillic-ext-600.css";
import "@fontsource/literata/latin-500.css";
import "@fontsource/literata/latin-500-italic.css";
import "@fontsource/literata/latin-600.css";
import "@fontsource/source-sans-3/cyrillic-400.css";
import "@fontsource/source-sans-3/cyrillic-500.css";
import "@fontsource/source-sans-3/cyrillic-600.css";
import "@fontsource/source-sans-3/cyrillic-ext-400.css";
import "@fontsource/source-sans-3/cyrillic-ext-500.css";
import "@fontsource/source-sans-3/cyrillic-ext-600.css";
import "@fontsource/source-sans-3/latin-400.css";
import "@fontsource/source-sans-3/latin-500.css";
import "@fontsource/source-sans-3/latin-600.css";
import "katex/dist/katex.min.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
