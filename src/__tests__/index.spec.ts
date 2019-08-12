import { codechecks } from "@codechecks/client";
import lighthouseKeeper from "..";
import { LighthouseReport } from "../lighthouse";
import { getLighthouseReport } from "../lighthouse";

type Mocked<T> = { [k in keyof T]: jest.Mock<any> };

jest.mock("../lighthouse");
jest.mock("../uploadHtmlReport");

describe("lighthouse-keeper", () => {
  const codeChecksMock = require("../__mocks__/@codechecks/client").codechecks as Mocked<
    typeof codechecks
  >;
  beforeEach(() => jest.resetAllMocks());

  it("should work not in PR context", async () => {
    codeChecksMock.isPr.mockReturnValue(false);
    const lighthouseReport: LighthouseReport = {
      htmlReport: "<html></html>",
      metrics: {
        performance: 90,
        "best-practices": 70,
        accessibility: 60,
        seo: 84,
      },
    };
    (getLighthouseReport as any).mockReturnValue(lighthouseReport);

    await lighthouseKeeper({
      url: "https://google.com",
    });

    expect(codechecks.report).toMatchInlineSnapshot(`[MockFunction]`);
    expect(codechecks.saveValue).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      "lighthouse-keeper/metrics.json",
      Object {
        "accessibility": 60,
        "best-practices": 70,
        "performance": 90,
        "seo": 84,
      },
    ],
  ],
  "results": Array [
    Object {
      "isThrow": false,
      "value": undefined,
    },
  ],
}
`);
  });
});
