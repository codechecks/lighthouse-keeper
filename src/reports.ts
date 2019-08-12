import * as codechecks from "@codechecks/client";
const table = require("markdown-table");

export function getReport(
  artifactComparison: any,
  baseBranchArtifact: any,
  reportLink: any,
): codechecks.CodeChecksReport {
  return {
    status: "success",
    name: "Lighthouse CI",
    shortDescription: getShortDescription(artifactComparison, baseBranchArtifact),
    longDescription: getLongDescription(artifactComparison),
    detailsUrl: reportLink,
  };
}

function getShortDescription(artifactComparison, base) {
  if (!base) {
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

function getLongDescription(artifactComparison) {
  // prettier-ignore
  const rows = [
    ['Name', 'Status', 'Score'],
    ...artifactComparison.map(a => [a.name, `${getIcon(a.diff)} ${diffWithSign(a.diff)}`, a.value])
  ]

  return table(rows) + "\n";
}

function getIcon(diff) {
  if (diff > 0) {
    return "✅";
  }

  if (diff < 0) {
    return "🔴";
  }

  return "";
}

function diffWithSign(value) {
  if (value > 0) {
    return `+${value}`;
  }

  if (value < 0) {
    return value.toString();
  }

  return "-";
}
