import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const outputDirectory = join(projectRoot, "dist");
const siteFiles = ["index.html", "styles.css", "app.js", "_headers"];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

for (const file of siteFiles) {
  await cp(join(projectRoot, file), join(outputDirectory, file));
}

await cp(join(projectRoot, "assets"), join(outputDirectory, "assets"), {
  recursive: true,
});

console.log(`Cloudflare Pages output ready: ${outputDirectory}`);
