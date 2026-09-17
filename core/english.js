"use strict";
const strings = require("./strings");
function text(_lang, key, ...args) {
  const template = strings[key] || `[missing text: ${key}]`;
  return String(template).replace(/%(\d+)/g, (_m, i) => args[Number(i) - 1] == null ? "" : String(args[Number(i) - 1]));
}
module.exports = { text, load: () => strings };
