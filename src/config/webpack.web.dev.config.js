'use strict';

const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./index');
const utils = require('../scripts/utils');
const ww_config = utils.requireModule(config.ww_config_name);
const compilePath = path.resolve(config.appDir, 'src');
const commonConifg = require('./webpack.web.common.config');

const dev = {
  entry: [require.resolve('webpack-hot-middleware/client')],
  mode: 'development',
  plugins: [new webpack.HotModuleReplacementPlugin()],
};

module.exports = merge(commonConifg, dev);
