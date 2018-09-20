const webpack = require('webpack');
const path = require('path');
const os = require('os');
const config = require('./index');
const utils = require('../scripts/utils');
const ww_config = utils.requireModule(config.ww_config_name);
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
const compilePath = path.resolve(config.appDir, 'src');

const { alias = {}, type = 'mobile' } = ww_config || {};

const plugins = [
  new HappyPack({
    debug: true,
    id: 'js',
    loaders: [
      {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            require.resolve('babel-preset-stage-0'),
            require.resolve('babel-preset-react'),
          ],
          plugins: [
            require.resolve('babel-plugin-transform-decorators-legacy'),
            require.resolve('babel-plugin-transform-async-to-generator'),
            [
              require.resolve('babel-plugin-import'),
              type === 'mobile'
                ? { libraryName: 'antd-mobile', style: 'css' }
                : { libraryName: 'antd', style: 'css' },
            ],
          ],
        },
      },
    ],
    threadPool: happyThreadPool,
  }),
  new HappyPack({
    debug: true,
    id: 'css',
    loaders: [require.resolve('style-loader'), require.resolve('css-loader')],
    threadPool: happyThreadPool,
  }),
  new HappyPack({
    debug: true,
    id: 'less',
    loaders: [require.resolve('style-loader'), require.resolve('less-loader')],
    threadPool: happyThreadPool,
  }),
  // new HappyPack({
  //   debug: true,
  //   id: 'sass',
  //   loaders: ['style-loader', 'sass-loader'],
  //   threadPool: happyThreadPool,
  // }),
];

module.exports = {
  entry: [
    require.resolve('babel-polyfill'),
    path.resolve(config.appDir, 'src/index.jsx'),
  ],
  output: {
    pathinfo: true,
    path: path.resolve(config.appDir, 'dist'),
    filename: 'bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/dist/',
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0,
          priority: 100,
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: require.resolve('happypack/loader'),
        options: {
          id: 'js',
        },
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
      {
        test: /\.css/,
        include: compilePath,
        loader: require.resolve('happypack/loader'),
        options: {
          id: 'css',
        },
      },
      // {
      //   test: /\.(scss|sass)$/,
      //   include: compilePath,
      //   loader: 'happypack/loader?sass',
      // },
      {
        test: /\.less/,
        include: compilePath,
        loader: require.resolve('happypack/loader'),
        options: {
          id: 'less',
        },
      },
    ],
  },
  plugins: plugins.concat([
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr;
      if (percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`📦   ${msg}`);
        stream.clearLine(1);
      }
    }),
  ]),
};
