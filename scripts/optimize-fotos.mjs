import { readdir, mkdir, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "public", "fotos");
const outputDirs = {
  small: path.join(root, "small"),
  medium: path.join(root, "medium"),
  large: path.join(root, "large"),
  webp: path.join(root, "webp"),
};
const sizes = {
  small: 640,
  medium: 1200,
  large: 1920,
};
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function ensureFolders() {
  await mkdir(root, { recursive: true });
  await Promise.all(Object.values(outputDirs).map((dir) => mkdir(dir, { recursive: true })));
}

function isSourceImage(fileName) {
  const extension = path.extname(fileName).toLowerCase();

  return imageExtensions.has(extension);
}

async function sourceFiles() {
  await ensureFolders();
  const entries = await readdir(root, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile() && isSourceImage(entry.name))
    .map((entry) => path.join(root, entry.name));
}

async function optimizeImage(filePath, sharp) {
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName);
  const baseName = path.basename(fileName, extension);

  await Promise.all(
    Object.entries(sizes).map(([sizeName, width]) =>
      sharp(filePath)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .toFile(path.join(outputDirs[sizeName], fileName)),
    ),
  );

  await sharp(filePath)
    .rotate()
    .resize({ width: sizes.large, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(outputDirs.webp, `${baseName}.webp`));

  console.log(`Optimizada: ${fileName}`);
}

async function processAll() {
  const { default: sharp } = await import("sharp").catch(() => {
    throw new Error("Falta instalar sharp. Ejecuta npm install antes de optimizar fotos.");
  });
  const files = await sourceFiles();

  if (files.length === 0) {
    console.log("No hay imágenes nuevas en public/fotos.");
    return;
  }

  await Promise.all(files.map((file) => optimizeImage(file, sharp)));
}

async function processWhenStable(fileName) {
  const filePath = path.join(root, fileName);
  const first = await stat(filePath).catch(() => null);

  if (!first?.isFile()) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 350));
  await processAll();
}

await ensureFolders();
await processAll();

if (process.argv.includes("--watch")) {
  console.log("Observando public/fotos. Agrega imágenes originales en esa carpeta.");
  watch(root, (eventType, fileName) => {
    if (eventType === "rename" && fileName && isSourceImage(fileName)) {
      processWhenStable(fileName).catch((error) => {
        console.error(error instanceof Error ? error.message : error);
      });
    }
  });
}
