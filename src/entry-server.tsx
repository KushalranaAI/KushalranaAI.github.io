import { renderToString } from "react-dom/server";
import App from "./App";

/** Build-time only: scripts/prerender.mjs puts this HTML into dist/index.html so the page paints before the JS loads. */
export const render = () => renderToString(<App />);
