# sk_20230315_web_scraper
Web Scraper for Tech Test, by default will access `https://wltest.dns-systems.net/`, scrape product option data and put them in a json file (in the same directory) with products sorted by
annual price (calculated) in descending order.

# Before starting

CLI was developed using
```
$ node -v
v14.20.0
```
and
```
$ yarn -v
1.22.17
```
I did not enforce node engine in package.json just in case you don't access to `nvm`

# Installation

```
yarn install
```

# Running locally
## Base
```
yarn start
```

## With comands
Following will show help menu
```
yarn start --help
```

Following will show the version
```
yarn start -V
```

## Modify scraper selectors (at your own risk)
Following will change title query CSS selector and scrape data from there instead of the default node
```
yarn start --titleSelector ".package-features .package-data"
```

# Running as global package
TBD

# Running tests
Make sure you have done `yarn install` and run `yarn test`