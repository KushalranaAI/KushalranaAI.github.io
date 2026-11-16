// Runs after `vite build`: renders the app to HTML once and writes it into dist/index.html.
// The browser shows that HTML immediately; React then takes over when the script arrives.
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const { render } = await import(pathToFileURL(resolve("dist-ssr/entry-server.js")).href);
const file = resolve("dist/index.html");
const empty = '<div id="root"></div>';
const page = readFileSync(file, "utf8");
if (!page.includes(empty)) throw new Error(`prerender: ${empty} not found in dist/index.html`);
const html = render();
if (!html.includes('id="work"') || !html.includes('id="contact"')) throw new Error("prerender: rendered HTML is missing sections");
writeFileSync(file, page.replace(empty, `<div id="root">${html}</div>`));
rmSync("dist-ssr", { recursive: true, force: true });
console.log(`prerendered ${(html.length / 1024).toFixed(0)} kB of HTML into dist/index.html`);
