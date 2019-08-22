import { LighthouseMetrics } from "./lighthouse/lighthouse";

export interface MetricComparison {
  name: string;
  value: number;
  diff: number;
}
export type ReportComparison = MetricComparison[];

export function compareReports(base: LighthouseMetrics, head: LighthouseMetrics): ReportComparison {
  function diffFor(key: keyof LighthouseMetrics, name: string): MetricComparison | undefined {
    if (!head[key]) {
      return undefined;
    }

    return {
      name,
      value: head[key]!,
      diff: head[key]! - (base[key] || 0),
    };
  }

  return ([
    diffFor("performance", "Performance"),
    diffFor("accessibility", "Accessibility"),
    diffFor("best-practices", "Best practices"),
    diffFor("seo", "SEO"),
    diffFor("pwa", "PWA"),
  ].filter(d => Boolean(d)) as any) as ReportComparison;
}
