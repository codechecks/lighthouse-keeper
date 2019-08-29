if (process.env.NODE_ENV !== "test") {
  const pkg = require("../package.json");
  require("please-upgrade-node")(pkg);
}

import { codechecks } from "@codechecks/client";

import { getReport } from "./reports";
import { UserProvidedOptions } from "./types";
import { parseOptions } from "./options";
import { runLighthouseAndGetReport } from "./lighthouse/lighthouse";
import { compareReports } from "./compareReports";
import { uploadHtmlReport } from "./uploadHtmlReport";
import { startServer } from "./start-server";
import { LighthouseReport } from "./lighthouse/types";

export const ARTIFACT_ROOT = "lighthouse-keeper";

export async function lighthouseKeeper(_options: UserProvidedOptions = {}): Promise<void> {
  const options = parseOptions(_options);

  let server;
  if (options.buildPath) {
    server = await startServer(options.buildPath);
  }

  const lighthouseReport = await runLighthouseAndGetReport(options.url);

  codechecks.saveValue(`${ARTIFACT_ROOT}/full-report.json`, lighthouseReport);
  const reportLink = await uploadHtmlReport(lighthouseReport.htmlReport);

  if (!codechecks.isPr()) {
    if (server) {
      server.close();
    }
    return;
  }

  const baseReport = await codechecks.getValue<LighthouseReport | undefined>(
    `${ARTIFACT_ROOT}/full-report.json`,
  );

  const reportComparison = compareReports(baseReport, lighthouseReport);

  await codechecks.report(
    getReport({
      reportComparison,
      baselineExists: !!baseReport,
      reportLink,
      minScores: options.minScores,
    }),
  );
  if (server) {
    server.close();
  }
}
export default lighthouseKeeper;
