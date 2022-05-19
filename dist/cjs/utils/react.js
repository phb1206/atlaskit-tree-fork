"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sameProps = void 0;

var sameProps = function sameProps(oldProps, newProps, props) {
  return props.find(function (p) {
    return oldProps[p] !== newProps[p];
  }) === undefined;
};

exports.sameProps = sameProps;