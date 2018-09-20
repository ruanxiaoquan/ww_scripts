const fs = require('fs');
const path = require('path');
const depends = require('./depends');

// const componentChoices = [
//   {
//     name: 'antd-mobile组件库',
//     value: 'antd-mobile',
//   },
//   {
//     name: 'antd组件库',
//     value: 'antd',
//   },
//   {
//     name: '不使用组件库',
//     value: '',
//   },
// ];

const templateChoices = [
  {
    name: 'mobile',
    value: 'mobile',
  },
  {
    name: 'pc',
    value: 'pc',
  },
  {
    name: 'javascript库',
    value: 'library',
  },
];

// app 运行目录
const appDir = fs.realpathSync(process.cwd());
const templatePath = path.resolve(__dirname, '../.temp');
const ww_config_name = 'ww_config.js';

function getPackageJson(options = {}) {
  const {
    projectName,
    description,
    template = 'mobile',
    version = '1.0.0',
  } = options;
  let dependencies = {};
  const devDependencies = {};
  switch (template) {
    case 'mobile':
      dependencies = depends.moblie;
      break;
    case 'pc':
      dependencies = depends.pc;
      break;
    case 'library':
      break;
  }
  let packageJsonTemplate = `
  {
    "name": "${projectName}",
    "version": "${version}",
    "description": "${description}",
    "main": "index.js",
    "scripts": {
      "start": "ww_cli dev",
      "build": "ww_cli build",
      "publish": "ww_cli publish",
      "dev": "node ../../bin/ww dev",
      "test": "echo 'Error: no test specified' && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": ${JSON.stringify(dependencies, null, 6)},
    "devDependencies": ${JSON.stringify(devDependencies, null, 6)}
  }
`;
  return packageJsonTemplate;
}

module.exports = {
  // componentChoices,
  templateChoices,
  appDir,
  templatePath,
  ww_config_name,
  getPackageJson,
};
