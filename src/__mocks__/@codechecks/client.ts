import * as CC from "@codechecks/client";
import { join } from "path";

export const codechecks: Partial<typeof CC.codechecks> = {
  report: jest.fn(),
  getValue: jest.fn(),
  saveValue: jest.fn(),
  getDirectory: jest.fn(),
  saveDirectory: jest.fn(),
  isPr: jest.fn(),
  context: {
    pr: {
      base: {
        sha: "0ac17a3da88d14445a92128393d13c39e9a5b3ec",
        currentBranchName: "master",
      },
      head: {
        currentSha: "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
        currentBranchName: "kk/feature-brach-1",
      },
    },
    currentSha: "eeb6f98b8d0a93de251ea3e4a9d02e61ec850286",
    currentBranchName: "kk/feature-brach-1",
    workspaceRoot: join(__dirname, "..", ".."),
  } as any,
};
