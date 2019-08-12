import { Options } from "./types";

const lighthouseReporter = require("lighthouse-ci/lib/lighthouse-reporter");
const { getChromeFlags } = require("lighthouse-ci/lib/config");

export async function getLighthouseReport(options: Options): Promise<LighthouseReport> {
  const lighthouseReport = await lighthouseReporter(
    options.url,
    { report: true },
    getChromeFlags(),
    {},
  );

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
