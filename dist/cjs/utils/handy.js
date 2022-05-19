"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = exports.oneOf = exports.noop = exports.between = void 0;

var noop = function noop() {};

exports.noop = noop;

var range = function range(n) {
  return Array.from({
    length: n
  }, function (v, i) {
    return i;
  });
};

exports.range = range;

var between = function between(min, max, number) {
  return Math.min(max, Math.max(min, number));
};

exports.between = between;

var oneOf = function oneOf(a, b) {
  return typeof a !== 'undefined' ? a : b;
};

exports.oneOf = oneOf;