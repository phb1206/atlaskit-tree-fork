"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSourcePath = exports.getItemById = exports.getIndexById = exports.getFlatItemPath = exports.getDestinationPath = void 0;

var _path = require("./path");

var _handy = require("./handy");

var getFlatItemPath = function getFlatItemPath(flattenedTree, sourceIndex) {
  return flattenedTree[sourceIndex].path;
};
/*
  Calculates the source path after drag&drop ends
 */


exports.getFlatItemPath = getFlatItemPath;
var getSourcePath = getFlatItemPath;
/*
    Calculates the destination path after drag&drop ends

    During dragging the items are displaced based on the location of the dragged item.
    Displacement depends on which direction the item is coming from.

    index
          -----------        -----------
    0     | item 0           | item 1 (displaced)
          -----------        -----------
    1     | item 1           | item 2 (displaced)
          -----------  --->  -----------      -----------
    2     | item 2                            | item 0 (dragged)
          -----------        -----------      -----------
    3     | item 3           | item 3
          -----------        -----------

   */

exports.getSourcePath = getSourcePath;

var getDestinationPath = function getDestinationPath(flattenedTree, sourceIndex, destinationIndex, level) {
  // Moving down
  var down = destinationIndex > sourceIndex; // Path of the source location

  var sourcePath = getSourcePath(flattenedTree, sourceIndex); // Stayed at the same place

  var sameIndex = destinationIndex === sourceIndex; // Path of the upper item where the item was dropped

  var upperPath = down ? flattenedTree[destinationIndex].path : flattenedTree[destinationIndex - 1] && flattenedTree[destinationIndex - 1].path; // Path of the lower item where the item was dropped

  var lowerPath = down || sameIndex ? flattenedTree[destinationIndex + 1] && flattenedTree[destinationIndex + 1].path : flattenedTree[destinationIndex].path;
  /*
    We are going to differentiate 4 cases:
      - item didn't change position, only moved horizontally
      - item moved to the top of a list
      - item moved between two items on the same level
      - item moved to the end of list. This is an ambiguous case.
  */
  // Stayed in place, might moved horizontally

  if (sameIndex) {
    if (typeof level !== 'number') {
      return sourcePath;
    }

    if (!upperPath) {
      // Not possible to move
      return sourcePath;
    }

    var minLevel = lowerPath ? lowerPath.length : 1;
    var maxLevel = Math.max(sourcePath.length, upperPath.length);
    var finalLevel = (0, _handy.between)(minLevel, maxLevel, level);
    var sameLevel = finalLevel === sourcePath.length;

    if (sameLevel) {
      // Didn't change level
      return sourcePath;
    }

    var previousPathOnTheFinalLevel = (0, _path.getPathOnLevel)(upperPath, finalLevel);
    return (0, _path.moveAfterPath)(previousPathOnTheFinalLevel, sourcePath);
  } // Moved to top of the list


  if (lowerPath && (0, _path.isTopOfSubtree)(lowerPath, upperPath)) {
    return lowerPath;
  } // Moved between two items on the same level


  if (upperPath && lowerPath && (0, _path.hasSameParent)(upperPath, lowerPath)) {
    if (down && (0, _path.hasSameParent)(upperPath, sourcePath)) {
      // if item was moved down within the list, it will replace the displaced item
      return upperPath;
    }

    return lowerPath;
  } // Moved to end of list


  if (upperPath) {
    // this means that the upper item is deeper in the tree.
    var _finalLevel = calculateFinalLevel(sourcePath, upperPath, lowerPath, level); // Insert to higher levels


    var _previousPathOnTheFinalLevel = (0, _path.getPathOnLevel)(upperPath, _finalLevel);

    return (0, _path.moveAfterPath)(_previousPathOnTheFinalLevel, sourcePath);
  } // In case of any other impossible case


  return sourcePath;
};

exports.getDestinationPath = getDestinationPath;

var calculateFinalLevel = function calculateFinalLevel(sourcePath, upperPath, lowerPath, level) {
  var upperLevel = upperPath.length;
  var lowerLevel = lowerPath ? lowerPath.length : 1;
  var sourceLevel = sourcePath.length;

  if (typeof level === 'number') {
    // Explicit disambiguation based on level
    // Final level has to be between the levels of bounding items, inclusive
    return (0, _handy.between)(lowerLevel, upperLevel, level);
  } // Automatic disambiguation based on the initial level


  return sourceLevel <= lowerLevel ? lowerLevel : upperLevel;
};

var getItemById = function getItemById(flattenedTree, id) {
  return flattenedTree.find(function (item) {
    return item.item.id === id;
  });
};

exports.getItemById = getItemById;

var getIndexById = function getIndexById(flattenedTree, id) {
  return flattenedTree.findIndex(function (item) {
    return item.item.id === id;
  });
};

exports.getIndexById = getIndexById;