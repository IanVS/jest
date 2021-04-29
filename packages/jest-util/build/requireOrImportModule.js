'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.default = requireOrImportModule;

function _path() {
  const data = require('path');

  _path = function () {
    return data;
  };

  return data;
}

function _url() {
  const data = require('url');

  _url = function () {
    return data;
  };

  return data;
}

var _interopRequireDefault = _interopRequireDefault2(
  require('./interopRequireDefault')
);

function _interopRequireDefault2(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
async function requireOrImportModule(filePath) {
  let module;

  if (!(0, _path().isAbsolute)(filePath) && filePath[0] === '.') {
    throw new Error(`Jest: requireOrImportModule path must be absolute`);
  }

  try {
    module = (0, _interopRequireDefault.default)(require(filePath)).default;
  } catch (error) {
    if (error.code === 'ERR_REQUIRE_ESM') {
      try {
        const configUrl = (0, _url().pathToFileURL)(filePath); // node `import()` supports URL, but TypeScript doesn't know that

        const importedConfig = await import(configUrl.href);

        if (!importedConfig.default) {
          throw new Error(
            `Jest: Failed to load ESM at ${filePath} - did you use a default export?`
          );
        }

        module = importedConfig.default;
      } catch (innerError) {
        if (innerError.message === 'Not supported') {
          throw new Error(
            `Jest: Your version of Node does not support dynamic import - please enable it or use a .cjs file extension for file ${filePath}`
          );
        }

        throw innerError;
      }
    } else {
      throw error;
    }
  }

  return module;
}
