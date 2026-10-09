import { copyFile, cp, lstat, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = path.join(root, "dist");
const files = ["index.html", "app.js", "styles.css", "design-polish.css", "favicon.svg", "robots.txt", "sitemap.xml"];
const assetExtensions = new Set([".webp", ".jpg", ".jpeg", ".png", ".svg", ".woff2", ".ttf", ".txt"]);

try {
  const stats = await lstat(output);
  if (stats.isSymbolicLink()) throw new Error("dist must not be a symbolic link");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await Promise.all(files.map(file => copyFile(path.join(root, file), path.join(output, file))));
await cp(path.join(root, "assets"), path.join(output, "assets"), {
  recursive: true,
  filter: async source => {
    const stats = await lstat(source);
    if (stats.isSymbolicLink() || path.basename(source).startsWith(".")) return false;
    return stats.isDirectory() || assetExtensions.has(path.extname(source).toLowerCase());
  },
});
const assets = await readdir(path.join(output, "assets"), { recursive: true });
console.log(`Static site ready in dist: ${files.length} root files, ${assets.length} asset entries.`);
