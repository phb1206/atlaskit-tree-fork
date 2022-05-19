import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { getParentPath, getIndexAmongSiblings } from './path';

/*
  Transforms tree structure into flat list of items for rendering purposes.
  We recursively go through all the elements and its children first on each level
 */
export var flattenTree = function flattenTree(tree) {
  var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return tree.items[tree.rootId] ? tree.items[tree.rootId].children.reduce(function (accum, itemId, index) {
    // iterating through all the children on the given level
    var item = tree.items[itemId];
    var currentPath = [].concat(_toConsumableArray(path), [index]); // we create a flattened item for the current item

    var currentItem = createFlattenedItem(item, currentPath); // we flatten its children

    var children = flattenChildren(tree, item, currentPath); // append to the accumulator

    return [].concat(_toConsumableArray(accum), [currentItem], _toConsumableArray(children));
  }, []) : [];
};
/*
  Constructs a new FlattenedItem
 */

var createFlattenedItem = function createFlattenedItem(item, currentPath) {
  return {
    item: item,
    path: currentPath
  };
};
/*
  Flatten the children of the given subtree
*/


var flattenChildren = function flattenChildren(tree, item, currentPath) {
  return item.isExpanded ? flattenTree({
    rootId: item.id,
    items: tree.items
  }, currentPath) : [];
};
/*
  Changes the tree data structure with minimal reference changes.
 */


export var mutateTree = function mutateTree(tree, itemId, mutation) {
  var itemToChange = tree.items[itemId];

  if (!itemToChange) {
    // Item not found
    return tree;
  } // Returning a clone of the tree structure and overwriting the field coming in mutation


  return {
    // rootId should not change
    rootId: tree.rootId,
    items: _objectSpread(_objectSpread({}, tree.items), {}, _defineProperty({}, itemId, _objectSpread(_objectSpread({}, itemToChange), mutation)))
  };
};
export var getItem = function getItem(tree, path) {
  var cursor = tree.items[tree.rootId];

  var _iterator = _createForOfIteratorHelper(path),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var i = _step.value;
      cursor = tree.items[cursor.children[i]];
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return cursor;
};
export var getParent = function getParent(tree, path) {
  var parentPath = getParentPath(path);
  return getItem(tree, parentPath);
};
export var getTreePosition = function getTreePosition(tree, path) {
  var parent = getParent(tree, path);
  var index = getIndexAmongSiblings(path);
  return {
    parentId: parent.id,
    index: index
  };
};

var hasLoadedChildren = function hasLoadedChildren(item) {
  return !!item.hasChildren && item.children.length > 0;
};

var isLeafItem = function isLeafItem(item) {
  return !item.hasChildren;
};

var removeItemFromTree = function removeItemFromTree(tree, position) {
  var sourceParent = tree.items[position.parentId];

  var newSourceChildren = _toConsumableArray(sourceParent.children);

  var itemRemoved = newSourceChildren.splice(position.index, 1)[0];
  var newTree = mutateTree(tree, position.parentId, {
    children: newSourceChildren,
    hasChildren: newSourceChildren.length > 0,
    isExpanded: newSourceChildren.length > 0 && sourceParent.isExpanded
  });
  return {
    tree: newTree,
    itemRemoved: itemRemoved
  };
};

var addItemToTree = function addItemToTree(tree, position, item) {
  var destinationParent = tree.items[position.parentId];

  var newDestinationChildren = _toConsumableArray(destinationParent.children);

  if (typeof position.index === 'undefined') {
    if (hasLoadedChildren(destinationParent) || isLeafItem(destinationParent)) {
      newDestinationChildren.push(item);
    }
  } else {
    newDestinationChildren.splice(position.index, 0, item);
  }

  return mutateTree(tree, position.parentId, {
    children: newDestinationChildren,
    hasChildren: true
  });
};

export var moveItemOnTree = function moveItemOnTree(tree, from, to) {
  var _removeItemFromTree = removeItemFromTree(tree, from),
      treeWithoutSource = _removeItemFromTree.tree,
      itemRemoved = _removeItemFromTree.itemRemoved;

  return addItemToTree(treeWithoutSource, to, itemRemoved);
};