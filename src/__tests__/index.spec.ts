import { codechecks } from "@codechecks/client";
import lighthouseKeeper from "..";
import { LighthouseReport } from "../lighthouse/types";
import { runLighthouseAndGetReport } from "../lighthouse/lighthouse";
import { merge } from "lodash";

type Mocked<T> = { [k in keyof T]: jest.Mock<any> };

export function fixtureFactory<T>(defaults: T): (params?: Partial<T>) => T {
  return (params = {}) => merge({}, defaults, params);
}

jest.mock("../lighthouse/lighthouse");
jest.mock("../uploadHtmlReport");

const reportFixture = fixtureFactory<LighthouseReport>({
  htmlReport: "<html></html>",
  metrics: {
    performance: 90,
    "best-practices": 70,
    accessibility: 60,
    seo: 84,
  },
  audits: [],
});

describe("lighthouse-keeper", () => {
  const codeChecksMock = require("../__mocks__/@codechecks/client").codechecks as Mocked<
    typeof codechecks
  >;
  beforeEach(() => jest.resetAllMocks());

  it("should work not in PR context", async () => {
    codeChecksMock.isPr.mockReturnValue(false);
    (runLighthouseAndGetReport as any).mockReturnValue(reportFixture());

    await lighthouseKeeper({
      url: "https://google.com",
    });

    expect(codechecks.report).toMatchInlineSnapshot(`[MockFunction]`);
    expect(codechecks.saveValue).toMatchInlineSnapshot(`
[MockFunction] {
  "calls": Array [
    Array [
      "lighthouse-keeper/full-report.json",
      Object {
        "audits": Array [],
        "htmlReport": "<html></html>",
        "metrics": Object {
          "accessibility": 60,
          "best-practices": 70,
          "performance": 90,
          "seo": 84,
        },
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

  it("should work in PR context", async () => {
    codeChecksMock.isPr.mockReturnValue(true);
    (runLighthouseAndGetReport as any).mockReturnValue(reportFixture());

    await lighthouseKeeper({
      url: "https://google.com",
    });

    expect(codechecks).toMatchInlineSnapshot(`
Object {
  "context": Object {
    "currentBranchName": "kk/feature-brach-1",
    "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
    "pr": Object {
      "base": Object {
        "currentBranchName": "master",
        "sha": "0ac17a3da88d14445a92128393d13c39e9a5b3ec",
      },
      "head": Object {
        "currentBranchName": "kk/feature-brach-1",
        "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
      },
    },
    "workspaceRoot": "/tmp/codechecks/root",
  },
  "getArtifactLink": [MockFunction],
  "getDirectory": [MockFunction],
  "getFile": [MockFunction],
  "getValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
  "isPr": [MockFunction] {
    "calls": Array [
      Array [],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": true,
      },
    ],
  },
  "report": [MockFunction] {
    "calls": Array [
      Array [
        Object {
          "longDescription": "| Name           | Status | Score | Min Score |
| :------------- | :----: | ----: | --------: |
| Performance    |  ✅ +90 |    90 |         - |
| Accessibility  |  ✅ +60 |    60 |         - |
| Best practices |  ✅ +70 |    70 |         - |
| SEO            |  ✅ +84 |    84 |         - |




## [Full report link 📝](undefined)",
          "name": "Lighthouse Keeper",
          "shortDescription": "New Lighthouse report generated!",
          "status": "success",
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
  "saveDirectory": [MockFunction],
  "saveFile": [MockFunction],
  "saveValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
        Object {
          "audits": Array [],
          "htmlReport": "<html></html>",
          "metrics": Object {
            "accessibility": 60,
            "best-practices": 70,
            "performance": 90,
            "seo": 84,
          },
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
}
`);
  });

  it("should work in PR context with a baseline", async () => {
    codeChecksMock.isPr.mockReturnValue(true);
    (runLighthouseAndGetReport as any).mockReturnValue(reportFixture());

    codeChecksMock.getValue.mockReturnValue(
      reportFixture({
        metrics: {
          performance: 83,
          "best-practices": 67,
          accessibility: 60,
          seo: 84,
        },
      }),
    );

    await lighthouseKeeper({
      url: "https://google.com",
    });

    expect(codechecks).toMatchInlineSnapshot(`
Object {
  "context": Object {
    "currentBranchName": "kk/feature-brach-1",
    "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
    "pr": Object {
      "base": Object {
        "currentBranchName": "master",
        "sha": "0ac17a3da88d14445a92128393d13c39e9a5b3ec",
      },
      "head": Object {
        "currentBranchName": "kk/feature-brach-1",
        "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
      },
    },
    "workspaceRoot": "/tmp/codechecks/root",
  },
  "getArtifactLink": [MockFunction],
  "getDirectory": [MockFunction],
  "getFile": [MockFunction],
  "getValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": Object {
          "audits": Array [],
          "htmlReport": "<html></html>",
          "metrics": Object {
            "accessibility": 60,
            "best-practices": 67,
            "performance": 83,
            "seo": 84,
          },
        },
      },
    ],
  },
  "isPr": [MockFunction] {
    "calls": Array [
      Array [],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": true,
      },
    ],
  },
  "report": [MockFunction] {
    "calls": Array [
      Array [
        Object {
          "longDescription": "| Name           | Status | Score | Min Score |
| :------------- | :----: | ----: | --------: |
| Performance    |  ✅ +7  |    90 |         - |
| Accessibility  |    -   |    60 |         - |
| Best practices |  ✅ +3  |    70 |         - |
| SEO            |    -   |    84 |         - |




## [Full report link 📝](undefined)",
          "name": "Lighthouse Keeper",
          "shortDescription": "2 metrics got better, good job!",
          "status": "success",
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
  "saveDirectory": [MockFunction],
  "saveFile": [MockFunction],
  "saveValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
        Object {
          "audits": Array [],
          "htmlReport": "<html></html>",
          "metrics": Object {
            "accessibility": 60,
            "best-practices": 70,
            "performance": 90,
            "seo": 84,
          },
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
}
`);
  });

  it("should work in PR context with a baseline", async () => {
    codeChecksMock.isPr.mockReturnValue(true);
    (runLighthouseAndGetReport as any).mockReturnValue(
      reportFixture({
        audits: [
          {
            title: "Document does not have a meta description",
            description:
              "Meta descriptions may be included in search results to concisely summarize page content.",
            score: 0,
            id: "meta-desc",
          },
        ],
      }),
    );

    codeChecksMock.getValue.mockReturnValue(
      reportFixture({
        metrics: {
          performance: 100,
        },
      }),
    );

    await lighthouseKeeper({
      url: "https://google.com",
      minScores: {
        performance: 95,
      },
    });

    expect(codechecks).toMatchInlineSnapshot(`
Object {
  "context": Object {
    "currentBranchName": "kk/feature-brach-1",
    "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
    "pr": Object {
      "base": Object {
        "currentBranchName": "master",
        "sha": "0ac17a3da88d14445a92128393d13c39e9a5b3ec",
      },
      "head": Object {
        "currentBranchName": "kk/feature-brach-1",
        "currentSha": "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
      },
    },
    "workspaceRoot": "/tmp/codechecks/root",
  },
  "getArtifactLink": [MockFunction],
  "getDirectory": [MockFunction],
  "getFile": [MockFunction],
  "getValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": Object {
          "audits": Array [],
          "htmlReport": "<html></html>",
          "metrics": Object {
            "accessibility": 60,
            "best-practices": 70,
            "performance": 100,
            "seo": 84,
          },
        },
      },
    ],
  },
  "isPr": [MockFunction] {
    "calls": Array [
      Array [],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": true,
      },
    ],
  },
  "report": [MockFunction] {
    "calls": Array [
      Array [
        Object {
          "longDescription": "| Name           | Status | Score | Min Score |
| :------------- | :----: | ----: | --------: |
| Performance    | 🔴 -10 |    90 |        95 |
| Accessibility  |    -   |    60 |         - |
| Best practices |    -   |    70 |         - |
| SEO            |    -   |    84 |         - |



## New failed audits (1):
### Document does not have a meta description
Meta descriptions may be included in search results to concisely summarize page content.

## [Full report link 📝](undefined)",
          "name": "Lighthouse Keeper",
          "shortDescription": "Performance scores dropped too low!",
          "status": "failure",
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
  "saveDirectory": [MockFunction],
  "saveFile": [MockFunction],
  "saveValue": [MockFunction] {
    "calls": Array [
      Array [
        "lighthouse-keeper/full-report.json",
        Object {
          "audits": Array [
            Object {
              "description": "Meta descriptions may be included in search results to concisely summarize page content.",
              "id": "meta-desc",
              "score": 0,
              "title": "Document does not have a meta description",
            },
          ],
          "htmlReport": "<html></html>",
          "metrics": Object {
            "accessibility": 60,
            "best-practices": 70,
            "performance": 90,
            "seo": 84,
          },
        },
      ],
    ],
    "results": Array [
      Object {
        "isThrow": false,
        "value": undefined,
      },
    ],
  },
}
`);
  });
});
