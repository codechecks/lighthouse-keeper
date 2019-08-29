import { CodeChecksReport } from "@codechecks/client";
import { ReportComparison, MetricComparison, FailedMetricComparison } from "./compareReports";
import { MinScores } from "./types";
import { LighthouseAudit } from "./lighthouse/types";

const table = require("markdown-table");

export function getReport({
  reportComparison,
  baselineExists,
  reportLink,
  minScores,
}: {
  reportComparison: ReportComparison;
  baselineExists: boolean;
  reportLink: string;
  minScores: MinScores;
}): CodeChecksReport {
  const failedMetrics = getFailedMetrics(reportComparison, minScores);

  return {
    status: failedMetrics.length > 0 ? "failure" : "success",
    name: "Lighthouse Keeper",
    shortDescription: getShortDescription(reportComparison, baselineExists, failedMetrics),
    longDescription: getLongDescription(reportComparison, failedMetrics, minScores, reportLink),
  };
}

function getFailedMetrics(
  comparison: ReportComparison,
  minScore: MinScores,
): FailedMetricComparison[] {
  const failedMetrics: FailedMetricComparison[] = [];

  for (const metricsComparison of comparison.metricsComparison) {
    const minValue = minScore[metricsComparison.key];
    if (minValue === undefined) {
      continue;
    }

    if (metricsComparison.value < minValue) {
      failedMetrics.push({ ...metricsComparison, minScore: minValue });
    }
  }

  return failedMetrics;
}

function getShortDescription(
  artifactComparison: ReportComparison,
  baselineExists: boolean,
  failedMetrics: FailedMetricComparison[],
): string {
  if (failedMetrics.length > 0) {
    return `${failedMetrics.map(m => m.name).join(", ")} scores dropped too low!`;
  }
  if (!baselineExists) {
    return "New Lighthouse report generated!";
  }

  const decreased = artifactComparison.metricsComparison.filter(c => c.diff < 0).length;
  const increased = artifactComparison.metricsComparison.filter(c => c.diff > 0).length;

  if (decreased > 0) {
    return `${decreased} metrics decreased, be careful!`;
  }

  if (increased > 0) {
    return `${increased} metrics got better, good job!`;
  }

  return `No changes in metrics detected!`;
}

function getLongDescription(
  artifactComparison: ReportComparison,
  failedMetrics: FailedMetricComparison[],
  minScores: MinScores,
  reportLink: string,
): string {
  function renderRow(metric: MetricComparison): string[] {
    const failedMetric = failedMetrics.find(fm => fm.key === metric.key);
    const minScore = minScores[metric.key];
    return [
      metric.name,
      `${getIcon(metric.diff, !!failedMetric)} ${diffWithSign(metric.diff)}`,
      metric.value.toString(),
      minScore ? minScore.toString() : "-",
    ];
  }

  function renderFailedAudits(newFailedAudits: LighthouseAudit[]): string {
    if (newFailedAudits.length === 0) {
      return "";
    }

    return `
## New failed audits (${newFailedAudits.length}):
${artifactComparison.failedAudits
  .map(a => `### ${a.title}\n${a.description}`)
  .join("\n\n---\n\n")}`;
  }

  function renderReportLink(reportLink: string): string {
    return `## [Full report link 📝](${reportLink})`;
  }

  // prettier-ignore
  const rows = [
    ['Name', 'Status', 'Score', 'Min Score'],
    ...artifactComparison.metricsComparison.map(a => renderRow(a))
  ]
  const metricsTable =
    table(rows, {
      align: ["l", "c", "r", "r"],
    }) + "\n";

  return [
    metricsTable,
    renderFailedAudits(artifactComparison.failedAudits),
    renderReportLink(reportLink),
  ].join("\n\n");
}

function getIcon(diff: number, failed: boolean): string {
  if (failed) {
    return "🔴";
  }

  if (diff > 0) {
    return "✅";
  }

  if (diff < 0) {
    return "⚠️";
  }

  return "";
}

function diffWithSign(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  if (value < 0) {
    return value.toString();
  }

  return "-";
}
