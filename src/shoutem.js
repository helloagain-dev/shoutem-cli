#!/usr/bin/env node

const semver = require('semver');
const path = require('path');
const getHomeDir = require('./home-dir');
require('colors');

const homeDir = getHomeDir();

if (!path.isAbsolute(homeDir)) {
  console.log(`ERROR: path ${homeDir} is not an absolute path.`.red);
  console.log('Please set your SHOUTEM_CLI_HOME environmental variable to an absolute path'.red);
  process.exit(1);
}

if (semver.lt(process.versions.node, '6.0.0')) {
  console.error(`You appear to be using Node v${process.versions.node}, however, Node 6 or later is required`);
  return;
}

const babelCachePath = path.join(homeDir, 'cache', 'babel-cache');
process.env.BABEL_CACHE_PATH = process.env.BABEL_CACHE_PATH || babelCachePath;

require('babel-register')({
  presets: [semver.lt(process.versions.node, '7.0.0') ? 'node6' : 'node7'],
  plugins: ['transform-object-rest-spread', 'transform-async-to-generator'],
  ignore: false,
  only: ['config', 'src', 'templates']
});

require('./cli');
