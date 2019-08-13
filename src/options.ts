import { UserProvidedOptions, Options } from "./types";

export function parseOptions(options: UserProvidedOptions): Options {
  if (!options.url && !options.buildPath) {
    throw new Error("url and buildPath is missing in config");
  }

  return {
    buildPath: options.buildPath,
    url: options.url || "http://localhost:3000",
  };
}
