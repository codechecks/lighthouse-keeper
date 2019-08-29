<p align="center">
  <img src="meta/logo.png" width="300" alt="lighthouse-keeper">
  <h3 align="center">Lighthouse keeper</h3>
  <p align="center">Keep an eye on Google Lighthouse score changes directly on GitHub 💡👀</p>
  <p align="center">Discover performance, accessability, SEO problems before they reach production</p>

  <p align="center">
    <a href="https://circleci.com/gh/codechecks/lighthouse-keeper"><img alt="Build Status" src="https://circleci.com/gh/codechecks/lighthouse-keeper/tree/master.svg?style=svg"></a>
    <a href="/package.json"><img alt="Software License" src="https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square"></a>
    <a href="https://codechecks.io"><img src="https://raw.githubusercontent.com/codechecks/docs/master/images/badges/badge-default.svg?sanitize=true" alt="codechecks.io"></a>
  </p>
</p>

## Demo

[Example Pull Request](https://github.com/krzkaczor/lighthouse-keeper-example/pull/2)

![Demo](meta/demo.gif)

## Features

<!-- prettier-ignore -->
👉 track changes in performance, accessibility etc. directly in GitHub PR interface<br>
👉 get detailed list of new failed audits<br>
👉 automatically fail PRs if score is too low<br>
👉 works with many different [CI providers](https://github.com/codechecks/docs/blob/master/supported-ci.md)<br>

## Install

```sh
npm install --save-dev @codechecks/lighthouse-keeper
```

## Usage

Lighthouse Keeper is built on [Codechecks](https://codechecks.io) — new open source code review
automation platform.

To use it, you need to install Codechecks GitHub App on a given repository and copy project secret
to your CI environment.

## Step by step guide

1. Install codechecks client and lighthouse-keeper:

```
npm install --save-dev @codechecks/client @codechecks/lighthouse-keeper
```

2. Create `codechecks.yml` file in a root of your project. It serves as a central configuration for
   all different codechecks plugins.

```yml
checks:
  - name: lighthouse-keeper
    options:
      buildPath: ./build
```

You might want to adjust the build path. To learn about all configuration options check out API
section of this document. We can dry run `lighthouse-keeper` locally. Just make sure that your build
exists and run `npx codechecks`.

Now we need to make sure that it runs on CI.

3. Visit [app.codechecks.io](https://app.codechecks.io).
4. Login with you github account and install Codechecks Github App on a desired repositories. Note:
   We don't have access to your code.
5. Find your project on the list and copy secret.
6. Add new environment variable to your CI configuration `CC_SECRET= <COPIED_SECRET>`.
7. Run `npx codechecks` as part of your CI pipeline after building the app.
8. That's it! 🔥Create your first PR and let codechecks record initial baseline. With Codechecks you
   can track build size, visual regressions and much more! Check out other plugins at
   [Awesome Codechecks](https://github.com/codechecks/awesome-codechecks)

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
