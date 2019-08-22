import { Options } from "../types";

import { runLighthouseAndGetReports } from "./runner";

export async function getLighthouseReport(options: Options): Promise<LighthouseReport> {
  const lighthouseReport = await runLighthouseAndGetReports(options.url);

  const metrics = lighthouseReport.categoryReport;
  const { htmlReport } = lighthouseReport;

  return {
    htmlReport,
    metrics,
  };
}

export interface LighthouseMetrics {
  performance?: number;
  accessibility?: number;
  "best-practices"?: number;
  seo?: number;
  pwa?: number;
}

export interface LighthouseReport {
  htmlReport: string;
  metrics: LighthouseMetrics;
}
