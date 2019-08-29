<p align="center">
  <h3 align="center">Lighthouse keeper</h3>
  <p align="center">Keep an eye on Google Lighthouse score changes 💡👀</p>

  <p align="center">
    <a href="https://circleci.com/gh/codechecks/lighthouse-keeper"><img alt="Build Status" src="https://circleci.com/gh/codechecks/lighthouse-keeper/tree/master.svg?style=svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
    <a href="https://codechecks.io"><img src="https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true" alt="codechecks.io"></a>
  </p>
</p>

## Install

```sh
npm install --save-dev @codechecks/lighthouse-keeper
```

## Usage

Are you new to codechecks? Check out
[getting started guide (it's simple)](https://github.com/codechecks/docs/blob/master/getting-started.md)!

Add to your `codechecks.yml` file:

```yml
checks:
  - name: lighthouse-keeper
    options:
      # just provide path to your build
      buildPath: ./build
      # or full url
      # url: https://google.com
      # you can specify minScores and automatically fail builds
      minScores:
        performance: 90
  # ...
```

## API

### lighthouseKeeper(options: Options): Promise\<void>

#### options

```typescript
interface Options {
  url?: string;
  buildPath?: string;
  minScores?: Dictionary<number>;
}
```

##### url

optional `string`<br> Provide URL that lighthouse will be ran against. `url` OR `buildPath` MUST be
provided.

##### buildPath

optional `string`<br> Provide relative path to directory with build. It will be served using
`http-server` package and lighthouse will be ran against it. `url` OR `buildPath` MUST be provided.

##### minScore

optional `Dictionary of numbers`<br> Provide minimal scores for each metric. Possible keys are:

- performance
- accessibility
- best-practices
- seo
- pwa

## Contributing

All contributions are welcomed. Read more in [CONTRIBUTING.md](./CONTRIBUTING.md)

## Licence

MIT @ [codechecks.io](https://codechecks.io)

## Acknowledges

Thanks go to @andreasonny83 for his support and creating the
[lighthouse-ci](https://github.com/andreasonny83/lighthouse-ci)
