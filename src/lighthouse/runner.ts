import * as chromeLauncher from "chrome-launcher";

const lighthouse = require("lighthouse");
const ReportGenerator = require("lighthouse/lighthouse-core/report/report-generator");

const launchChromeAndRunLighthouse = async (url: string) => {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--disable-gpu", "--headless", "--no-zygote", "--no-sandbox"],
  });
  const flags = {
    port: chrome.port,
    output: "json",
  };

  const result = await lighthouse(url, flags);
  await chrome.kill();

  return result;
};

function createHtmlReport(results: any): string {
  return ReportGenerator.generateReportHtml(results);
}

function createJsonReport(results: any): any {
  return JSON.parse(ReportGenerator.generateReport(results, "json"));
}

function createCategoryReport(results: any): any {
  const { categories } = results;

  return Object.keys(categories).reduce((categoryReport: any, categoryName: string) => {
    const category = results.categories[categoryName];
    categoryReport[category.id] = Math.round(category.score * 100);
    return categoryReport;
  }, {});
}

export async function runLighthouseAndGetReports(url: string): Promise<any> {
  const lighthouseResult = await launchChromeAndRunLighthouse(url);

  const htmlReport = createHtmlReport(lighthouseResult.lhr);
  const jsonReport = createJsonReport(lighthouseResult.lhr);

  const categoryReport = createCategoryReport(lighthouseResult.lhr);

  // how to find failing audits:
  //jsonReport.audits WHERE "score" === 0

  return { categoryReport, htmlReport, jsonReport };
}
