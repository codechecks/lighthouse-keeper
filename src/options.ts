import { UserProvidedOptions, Options } from "./types";

export function parseOptions(options: UserProvidedOptions): Options {
  if (!options.url) {
    throw new Error("url is missing in config");
  }

  return {
    url: options.url!,
  };
}
