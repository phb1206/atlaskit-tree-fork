import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { getTreePosition } from '../../utils/tree';
import { getDestinationPath, getSourcePath } from '../../utils/flat-tree';

/*
    Translates a drag&drop movement from an index based position to a relative (parent, index) position
*/
export var calculateFinalDropPositions = function calculateFinalDropPositions(tree, flattenedTree, dragState) {
  var source = dragState.source,
      destination = dragState.destination,
      combine = dragState.combine,
      horizontalLevel = dragState.horizontalLevel;
  var sourcePath = getSourcePath(flattenedTree, source.index);
  var sourcePosition = getTreePosition(tree, sourcePath);

  if (combine) {
    return {
      sourcePosition: sourcePosition,
      destinationPosition: {
        parentId: combine.draggableId
      }
    };
  }

  if (!destination) {
    return {
      sourcePosition: sourcePosition,
      destinationPosition: undefined
    };
  }

  var destinationPath = getDestinationPath(flattenedTree, source.index, destination.index, horizontalLevel);

  var destinationPosition = _objectSpread({}, getTreePosition(tree, destinationPath));

  return {
    sourcePosition: sourcePosition,
    destinationPosition: destinationPosition
  };
};