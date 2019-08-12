import { getReport } from "./reports";

const { join } = require("path");
const fs = require("fs");
const { codechecks } = require("@codechecks/client");
const { dir } = require("tmp-promise");

const lighthouseReporter = require("lighthouse-ci/lib/lighthouse-reporter");
const { getChromeFlags } = require("lighthouse-ci/lib/config");

const ARTIFACT_ROOT = "lighthouse-ci";

export async function lighthouseKeeper(options = {}) {
  const lighthouseReport = await lighthouseReporter(
    options.url,
    { report: true },
    getChromeFlags(),
    {},
  );

  const metrics = lighthouseReport.categoryReport;
  const { htmlReport } = lighthouseReport;

  codechecks.saveValue(`${ARTIFACT_ROOT}/metrics.json`, metrics);
  const reportLink = await uploadHtmlReport(htmlReport);

  if (!codechecks.isPr()) {
    return;
  }

  const baseBranchArtifact = await codechecks.getValue(`${ARTIFACT_ROOT}/metrics.json`);

  const artifactComparison = compareArtifacts(baseBranchArtifact, metrics);

  await codechecks.report(getReport(artifactComparison, baseBranchArtifact, reportLink));
}
export default lighthouseKeeper;

async function uploadHtmlReport(htmlReport) {
  const { path: randomDir } = await dir();
  const outputPath = join(randomDir, "lighthouse-report.html");

  fs.writeFileSync(outputPath, htmlReport);
  await codechecks.saveFile(`${ARTIFACT_ROOT}/report.html`, outputPath);

  return codechecks.getArtifactLink(`${ARTIFACT_ROOT}/report.html`);
}

function compareArtifacts(base = {}, head) {
  function diffFor(key, name) {
    if (!head[key]) {
      return undefined;
    }

    return {
      name,
      value: head[key],
      diff: head[key] - (base[key] || 0),
    };
  }

  return [
    diffFor("performance", "Performance"),
    diffFor("accessibility", "Accessibility"),
    diffFor("best-practices", "Best practices"),
    diffFor("seo", "SEO"),
    diffFor("pwa", "PWA"),
  ].filter(d => Boolean(d));
}
