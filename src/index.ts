import { codechecks } from "@codechecks/client";

import { getReport } from "./reports";
import { UserProvidedOptions } from "./types";
import { parseOptions } from "./options";
import { getLighthouseReport, LighthouseMetrics } from "./lighthouse";
import { compareReports } from "./compareReports";
import { uploadHtmlReport } from "./uploadHtmlReport";
import { startServer } from "./start-server";

export const ARTIFACT_ROOT = "lighthouse-keeper";

export async function lighthouseKeeper(_options: UserProvidedOptions = {}): Promise<void> {
  const options = parseOptions(_options);

  let server;
  if (options.buildPath) {
    server = await startServer(options.buildPath);
  }

  const lighthouseReport = await getLighthouseReport(options);

  codechecks.saveValue(`${ARTIFACT_ROOT}/metrics.json`, lighthouseReport.metrics);
  const reportLink = await uploadHtmlReport(lighthouseReport.htmlReport);

  if (!codechecks.isPr()) {
    if (server) {
      server.close();
    }
    return;
  }

  const baseMetrics = await codechecks.getValue<LighthouseMetrics | undefined>(
    `${ARTIFACT_ROOT}/metrics.json`,
  );

  const reportComparison = compareReports(baseMetrics || {}, lighthouseReport.metrics);

  await codechecks.report(
    getReport({ reportComparison, baselineExists: !!baseMetrics, reportLink }),
  );
  if (server) {
    server.close();
  }
}
export default lighthouseKeeper;
