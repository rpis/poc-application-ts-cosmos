const NamingStrategy = require('typeorm-model-generator/dist/src/NamingStrategy');

const pluralize = require('pluralize')

// https://github.com/Kononnable/typeorm-model-generator/issues/171
NamingStrategy.entityName = function (entityName, entity) {
  return pluralize.singular(entityName);
}

// https://github.com/Kononnable/typeorm-model-generator/issues/236
NamingStrategy.fileName = function (fileName) {
  // https://docs.nestjs.com/openapi/cli-plugin
  // Add entity suffix for analysed in swagger plugin
  return `${fileName}.entity`;
}

module.exports = {
  ...NamingStrategy
}