import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildOdsInfographicSvg } from "../lib/build-ods-infographic-svg";
import { odsItems } from "../lib/content";

const outDir = join(process.cwd(), "public/brand/ods");
mkdirSync(outDir, { recursive: true });

for (const item of odsItems) {
  const fileName = `${item.id}-infografia.svg`;
  writeFileSync(join(outDir, fileName), buildOdsInfographicSvg(item), "utf8");
  console.log("Wrote", fileName);
}
