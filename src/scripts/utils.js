const config = require('../config');
const path = require('path');
const fs = require('fs-extra');

function requireModule(p) {
  const pt = path.resolve(config.appDir, p);
  const exist = fs.existsSync(pt);
  if (exist) return require(pt);
  return undefined;
}

module.exports = {
  requireModule,
};
