'use strict';

const express = require('express');
const webpack = require('webpack');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs-extra');
const open = require('open');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackCfg = require('../config/webpack.web.dev.config');
const config = require('../config');
const utils = require('./utils');
const ww_config = utils.requireModule(config.ww_config_name);

class DevServer {
  constructor(options = {}) {
    this.app = null;
    this.compiler = {};
    this.createServer();
  }

  run() {
    const { devServer = {} } = ww_config || {};
    const { host = '127.0.0.1', port = 8888 } = devServer;
    console.log('开发服务启动中...');
    this.app.listen(port, host, (err) => {
      if (err) {
        console.log('启动服务器失败', err);
        return;
      }
      console.log(`成功开启开发服务器:http://${host}:${port}`);
      open(`http://${host}:${port}`);
    });
  }

  createServer() {
    const updateCfg = utils.requireModule('webpack.dev.update.config.js');
    this.compiler = webpack(webpackCfg);
    this.app = express();
    this.app.engine('.html', require('ejs').__express);
    this.app.set('view engine', 'html');
    this.app.use(morgan('dev'));
    this.app.use(express.static('static'));
    this.app.use(
      webpackDevMiddleware(this.compiler, {
        publicPath: webpackCfg.output.publicPath,
        hot: true,
        stats: {
          colors: true,
        },
      }),
    );
    this.app.use(webpackHotMiddleware(this.compiler));
    this.app.get('*', (req, res) => {
      const viewPath = path.resolve(config.appDir, 'public', 'index.html');
      return res.sendFile(viewPath);
    });
  }
}

function requireModule(path) {
  const exist = fs.existsSync(path);
  if (exist) return require(path);
  return {};
}

module.exports = DevServer;
