import { codechecks } from "@codechecks/client";
import { join } from "path";
import * as fs from "fs";
import { dir } from "tmp-promise";

import { getReport } from "./reports";
import { UserProvidedOptions } from "./types";
import { parseOptions } from "./options";
import { getLighthouseReport, LighthouseMetrics } from "./lighthouse";
import { compareReports } from "./compareReports";

const ARTIFACT_ROOT = "lighthouse-keeper";

export async function lighthouseKeeper(_options: UserProvidedOptions = {}): Promise<void> {
  const options = parseOptions(_options);

  const lighthouseReport = await getLighthouseReport(options);

  codechecks.saveValue(`${ARTIFACT_ROOT}/metrics.json`, lighthouseReport.metrics);
  const reportLink = await uploadHtmlReport(lighthouseReport.htmlReport);

  if (!codechecks.isPr()) {
    return;
  }

  const baseMetrics = await codechecks.getValue<LighthouseMetrics | undefined>(
    `${ARTIFACT_ROOT}/metrics.json`,
  );

  const reportComparison = compareReports(baseMetrics || {}, lighthouseReport.metrics);

  await codechecks.report(
    getReport({ reportComparison, baselineExists: !!baseMetrics, reportLink }),
  );
}
export default lighthouseKeeper;

async function uploadHtmlReport(htmlReport: string): Promise<string> {
  const { path: randomDir } = await dir();
  const outputPath = join(randomDir, "lighthouse-report.html");

  fs.writeFileSync(outputPath, htmlReport);
  await codechecks.saveFile(`${ARTIFACT_ROOT}/report.html`, outputPath);

  return codechecks.getArtifactLink(`${ARTIFACT_ROOT}/report.html`);
}
