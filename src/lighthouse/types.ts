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
  audits: LighthouseAudit[];
}

export interface LighthouseAudit {
  id: string;
  title: string;
  description: string;
  score: number | null;
}
