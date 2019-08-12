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
      # you need to spawn server serving your content by yourself
      url: "http://localhost:8080"
  # ...
```

## API

## Contributing

All contributions are welcomed. Read more in [CONTRIBUTING.md](./CONTRIBUTING.md)

## Licence

MIT @ [codechecks.io](https://codechecks.io)
