import { codechecks } from "@codechecks/client";
import { join } from "path";
import * as fs from "fs";
import * as tmp from "tmp-promise";

import { ARTIFACT_ROOT } from ".";

export async function uploadHtmlReport(htmlReport: string): Promise<string> {
  const { path: randomDir } = await tmp.dir();
  const outputPath = join(randomDir, "lighthouse-report.html");

  fs.writeFileSync(outputPath, htmlReport);
  await codechecks.saveFile(`${ARTIFACT_ROOT}/report.html`, outputPath);

  return codechecks.getArtifactLink(`${ARTIFACT_ROOT}/report.html`);
}
