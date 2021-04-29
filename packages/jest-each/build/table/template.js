'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getPath = getPath;
exports.default = void 0;

function _jestGetType() {
  const data = require('jest-get-type');

  _jestGetType = function () {
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

/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
var _default = (title, headings, row) => {
  const table = convertRowToTable(row, headings);
  const templates = convertTableToTemplates(table, headings);
  return templates.map((template, index) => ({
    arguments: [template],
    title: interpolate(title, template, index)
  }));
};

exports.default = _default;

const convertRowToTable = (row, headings) =>
  Array.from({
    length: row.length / headings.length
  }).map((_, index) =>
    row.slice(
      index * headings.length,
      index * headings.length + headings.length
    )
  );

const convertTableToTemplates = (table, headings) =>
  table.map(row =>
    row.reduce(
      (acc, value, index) =>
        Object.assign(acc, {
          [headings[index]]: value
        }),
      {}
    )
  );

const interpolate = (title, template, index) =>
  Object.keys(template)
    .reduce(getMatchingKeyPaths(title), []) // aka flatMap
    .reduce(replaceKeyPathWithValue(template), title)
    .replace('$#', '' + index);

const getMatchingKeyPaths = title => (matches, key) =>
  matches.concat(title.match(new RegExp(`\\$${key}[\\.\\w]*`, 'g')) || []);

const replaceKeyPathWithValue = template => (title, match) => {
  const keyPath = match.replace('$', '').split('.');
  const value = getPath(template, keyPath);

  if ((0, _jestGetType().isPrimitive)(value)) {
    return title.replace(match, String(value));
  }

  return title.replace(
    match,
    (0, _prettyFormat().format)(value, {
      maxDepth: 1,
      min: true
    })
  );
};
/* eslint import/export: 0*/

function getPath(template, [head, ...tail]) {
  if (!head || !template.hasOwnProperty || !template.hasOwnProperty(head))
    return template;
  return getPath(template[head], tail);
}
