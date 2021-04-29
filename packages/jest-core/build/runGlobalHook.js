'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = void 0;

function _url() {
  const data = require('url');

  _url = function () {
    return data;
  };

  return data;
}

function util() {
  const data = _interopRequireWildcard(require('util'));

  util = function () {
    return data;
  };

  return data;
}

function _pEachSeries() {
  const data = _interopRequireDefault(require('p-each-series'));

  _pEachSeries = function () {
    return data;
  };

  return data;
}

function _transform() {
  const data = require('@jest/transform');

  _transform = function () {
    return data;
  };

  return data;
}

function _jestUtil() {
  const data = require('jest-util');

  _jestUtil = function () {
    return data;
  };

  return data;
}

function _prettyFormat() {
  const data = require('pretty-format');

  _prettyFormat = function () {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== 'function') return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function () {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return {default: obj};
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var _default = async ({allTests, globalConfig, moduleName}) => {
  const globalModulePaths = new Set(
    allTests.map(test => test.context.config[moduleName])
  );

  if (globalConfig[moduleName]) {
    globalModulePaths.add(globalConfig[moduleName]);
  }

  if (globalModulePaths.size > 0) {
    await (0, _pEachSeries().default)(globalModulePaths, async modulePath => {
      if (!modulePath) {
        return;
      }

      const correctConfig = allTests.find(
        t => t.context.config[moduleName] === modulePath
      );
      const projectConfig = correctConfig
        ? correctConfig.context.config // Fallback to first config
        : allTests[0].context.config;
      const transformer = await (0, _transform().createScriptTransformer)(
        projectConfig
      );

      try {
        await transformer.requireAndTranspileModule(modulePath, async m => {
          const globalModule = (0, _jestUtil().interopRequireDefault)(m)
            .default;

          if (typeof globalModule !== 'function') {
            throw new TypeError(
              `${moduleName} file must export a function at ${modulePath}`
            );
          }

          await globalModule(globalConfig);
        });
      } catch (error) {
        if (error && error.code === 'ERR_REQUIRE_ESM') {
          const configUrl = (0, _url().pathToFileURL)(modulePath); // node `import()` supports URL, but TypeScript doesn't know that

          const importedConfig = await import(configUrl.href);

          if (!importedConfig.default) {
            throw new Error(
              `Jest: Failed to load ESM transformer at ${modulePath} - did you use a default export?`
            );
          }

          const globalModule = importedConfig.default;

          if (typeof globalModule !== 'function') {
            throw new TypeError(
              `${moduleName} file must export a function at ${modulePath}`
            );
          }

          await globalModule(globalConfig);
        } else {
          if (util().types.isNativeError(error)) {
            error.message = `Jest: Got error running ${moduleName} - ${modulePath}, reason: ${error.message}`;
            throw error;
          }

          throw new Error(
            `Jest: Got error running ${moduleName} - ${modulePath}, reason: ${(0,
            _prettyFormat().format)(error, {
              maxDepth: 3
            })}`
          );
        }
      }
    });
  }

  return Promise.resolve();
};

exports.default = _default;
