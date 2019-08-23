import { Options } from "../types";

import { runLighthouseAndGetReports } from "./runner";
import { LighthouseReport } from "./types";

export async function getLighthouseReport(options: Options): Promise<LighthouseReport> {
  const lighthouseReport = await runLighthouseAndGetReports(options.url);

  return lighthouseReport;
}
