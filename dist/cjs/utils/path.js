"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moveAfterPath = exports.isTopOfSubtree = exports.isSamePath = exports.isLowerSibling = exports.hasSameParent = exports.getPathOnLevel = exports.getParentPath = exports.getIndexAmongSiblings = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

/*
  Checking if two given path are equal
 */
var isSamePath = function isSamePath(a, b) {
  if (a === b) {
    return true;
  }

  return a.length === b.length && a.every(function (v, i) {
    return v === b[i];
  });
};
/*
  Checks if the two paths have the same parent
 */


exports.isSamePath = isSamePath;

var hasSameParent = function hasSameParent(a, b) {
  return isSamePath(getParentPath(a), getParentPath(b));
};
/*
  Calculates the parent path for a path
*/


exports.hasSameParent = hasSameParent;

var getParentPath = function getParentPath(child) {
  return child.slice(0, child.length - 1);
};
/*
  It checks if the item is on top of a sub tree based on the two neighboring items, which are above or below the item.
*/


exports.getParentPath = getParentPath;

var isTopOfSubtree = function isTopOfSubtree(belowPath, abovePath) {
  return !abovePath || isParentOf(abovePath, belowPath);
};

exports.isTopOfSubtree = isTopOfSubtree;

var isParentOf = function isParentOf(parent, child) {
  return isSamePath(parent, getParentPath(child));
};

var getIndexAmongSiblings = function getIndexAmongSiblings(path) {
  var lastIndex = path[path.length - 1];
  return lastIndex;
};

exports.getIndexAmongSiblings = getIndexAmongSiblings;

var getPathOnLevel = function getPathOnLevel(path, level) {
  return path.slice(0, level);
};

exports.getPathOnLevel = getPathOnLevel;

var moveAfterPath = function moveAfterPath(after, from) {
  var newPath = (0, _toConsumableArray2.default)(after);
  var movedDownOnTheSameLevel = isLowerSibling(newPath, from);

  if (!movedDownOnTheSameLevel) {
    // not moved within the same subtree
    newPath[newPath.length - 1] += 1;
  }

  return newPath;
};

exports.moveAfterPath = moveAfterPath;

var isLowerSibling = function isLowerSibling(a, other) {
  return hasSameParent(a, other) && getIndexAmongSiblings(a) > getIndexAmongSiblings(other);
};

exports.isLowerSibling = isLowerSibling;