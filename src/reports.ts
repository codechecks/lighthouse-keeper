import { CodeChecksReport } from "@codechecks/client";
import { ReportComparison } from "./compareReports";

const table = require("markdown-table");

export function getReport({
  reportComparison,
  baselineExists,
  reportLink,
}: {
  reportComparison: ReportComparison;
  baselineExists: boolean;
  reportLink: string;
}): CodeChecksReport {
  return {
    status: "success",
    name: "Lighthouse Keeper",
    shortDescription: getShortDescription(reportComparison, baselineExists),
    longDescription: getLongDescription(reportComparison),
    detailsUrl: reportLink,
  };
}

function getShortDescription(
  artifactComparison: ReportComparison,
  baselineExists: boolean,
): string {
  if (!baselineExists) {
    return "New Lighthouse report generated!";
  }

  const decreased = artifactComparison.filter(c => c.diff < 0).length;
  const increased = artifactComparison.filter(c => c.diff > 0).length;

  if (decreased > 0) {
    return `${decreased} metrics decreased, be careful!`;
  }

  if (increased > 0) {
    return `${increased} metrics got better, good job!`;
  }

  return `No changes in metrics detected!`;
}

function getLongDescription(artifactComparison: ReportComparison): string {
  // prettier-ignore
  const rows = [
    ['Name', 'Status', 'Score'],
    ...artifactComparison.map(a => [a.name, `${getIcon(a.diff)} ${diffWithSign(a.diff)}`, a.value])
  ]

  return table(rows) + "\n";
}

function getIcon(diff: number): string {
  if (diff > 0) {
    return "✅";
  }

  if (diff < 0) {
    return "🔴";
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
