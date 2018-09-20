'use strict';

const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const shell = require('shelljs');
const config = require('../config');

function create(project = {}) {
  const asks = [];
  const { projectName } = project;
  asks.push({
    type: 'input',
    name: 'projectName',
    message: '请输入项目名',
    default: projectName,
    validate: (input) => {
      if (projectName) {
        return true;
      }
      if (!input) {
        return '项目名称不能为空！';
      }
      if (fs.existsSync(input)) {
        return '当前目录已经存在同名项目，请换一个项目名！';
      }
      return true;
    },
  });

  asks.push({
    type: 'input',
    name: 'description',
    message: '请输入项目描述',
  });

  asks.push({
    type: 'input',
    name: 'version',
    message: '请输入项目版本号',
    default: '1.0.0',
  });

  // asks.push({
  //   type: 'list',
  //   name: 'component',
  //   message: '请选择预项目类型',
  //   choices: config.componentChoices,
  // });

  asks.push({
    type: 'list',
    name: 'template',
    message: '请选择初始化模板',
    choices: config.templateChoices,
  });

  inquirer
    .prompt(asks)
    .then((res) => {
      console.log(res);
      createProject(res);
    })
    .catch((err) => {
      lib.log.err(err);
    });
}

function createProject(project = {}) {
  const { projectName, component, template, description, version } = project;
  const tPath = path.resolve(config.templatePath, template);
  const destPath = path.resolve(config.appDir, projectName);
  try {
    const packageJson = config.getPackageJson(project);
    fs.copySync(tPath, destPath);
    fs.writeFileSync(path.resolve(destPath, 'package.json'), packageJson);
    console.log('拷贝项目模板成功');
    const cfg = createConfigFile(project);
    fs.writeFileSync(path.resolve(destPath, 'ww.config.js'), cfg);
    console.log('初始化配置文件成功');
  } catch (error) {
    console.log('初始化项目失败', error);
  }
}

function createConfigFile(project = {}) {
  const { projectName, component, template } = project;
  const cfg = {
    projectName,
    component,
    type: template,
    alias: {},
  };
  return `module.exports = ${JSON.stringify(cfg, null, 2)}`;
}

module.exports = { create };
