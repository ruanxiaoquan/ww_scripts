'use strict';

const chalk = require('chalk');
const init = require('../src/scripts/init');
const DevServer = require('../src/scripts/devServer');

const argv = require('yargs')
  .usage('Usage：$0 <command> [options]')
  .option('n', {
    alias: 'name',
    type: 'string',
    describe: '项目名称',
  })
  .alias('h', 'help')
  .epilog('copyright 2018').argv;
const cmd = argv._[0] || '';
switch (cmd) {
  case 'init':
    const projectName = argv._[1] || argv.n;
    init.create({
      projectName,
    });
    break;
  case 'dev':
    new DevServer().run();
    break;
  case 'build':
    break;
  case 'publish':
    break;
  default:
    console.log('没有此命令');
    process.exit(1);
    break;
}
