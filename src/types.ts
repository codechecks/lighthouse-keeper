import { Dictionary } from "ts-essentials";

export type MinScores = Dictionary<number | undefined>;

export interface UserProvidedOptions {
  url?: string;
  buildPath?: string;
  minScores?: MinScores;
}

export interface Options {
  url: string;
  buildPath?: string;
  minScores: MinScores;
}
