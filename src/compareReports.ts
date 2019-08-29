import { LighthouseMetrics, LighthouseReport, LighthouseAudit } from "./lighthouse/types";
import { differenceBy } from "lodash";

export interface MetricComparison {
  name: string;
  key: string;
  value: number;
  diff: number;
}
export type FailedMetricComparison = MetricComparison & {
  minScore: number;
};

export type ReportComparison = {
  metricsComparison: MetricComparison[];
  failedAudits: LighthouseAudit[];
};

export function compareReports(
  base: LighthouseReport | undefined,
  head: LighthouseReport,
): ReportComparison {
  const metricsComparison = compareMetrics(base ? base.metrics : {}, head.metrics);
  const failedAudits = getNewFailedAudits(base ? base.audits : [], head.audits);

  return {
    metricsComparison,
    failedAudits,
  };
}

function compareMetrics(base: LighthouseMetrics, head: LighthouseMetrics): MetricComparison[] {
  function diffFor(key: keyof LighthouseMetrics, name: string): MetricComparison | undefined {
    if (!head[key]) {
      return undefined;
    }

    return {
      name,
      key,
      value: head[key]!,
      diff: head[key]! - (base[key] || 0),
    };
  }

  return [
    diffFor("performance", "Performance"),
    diffFor("accessibility", "Accessibility"),
    diffFor("best-practices", "Best practices"),
    diffFor("seo", "SEO"),
    diffFor("pwa", "PWA"),
  ].filter(d => Boolean(d)) as any;
}

function getNewFailedAudits(base: LighthouseAudit[], head: LighthouseAudit[]): LighthouseAudit[] {
  function getFailedAudits(audits: LighthouseAudit[]): LighthouseAudit[] {
    const failedAudits = audits.filter(a => a.score === 0);
    return failedAudits;
  }

  const failedBaseAudits = getFailedAudits(base);
  const failedHeadAudits = getFailedAudits(head);
  const newFailedAudits = differenceBy(failedHeadAudits, failedBaseAudits, "id");

  return newFailedAudits;
}
