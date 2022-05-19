"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireWildcard(require("react"));

var _reactBeautifulDndNext = require("react-beautiful-dnd-next");

var _cssBoxModel = require("css-box-model");

var _TreeUtils = require("./Tree-utils");

var _handy = require("../../utils/handy");

var _tree = require("../../utils/tree");

var _TreeItem = _interopRequireDefault(require("../TreeItem"));

var _flatTree = require("../../utils/flat-tree");

var _delayedFunction = _interopRequireDefault(require("../../utils/delayed-function"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var Tree = /*#__PURE__*/function (_Component) {
  (0, _inherits2.default)(Tree, _Component);

  var _super = _createSuper(Tree);

  function Tree() {
    var _this;

    (0, _classCallCheck2.default)(this, Tree);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "state", {
      flattenedTree: [],
      draggedItemId: undefined
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "itemsElement", {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "expandTimer", new _delayedFunction.default(500));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onDragStart", function (result) {
      var onDragStart = _this.props.onDragStart;
      _this.dragState = {
        source: result.source,
        destination: result.source,
        mode: result.mode
      };

      _this.setState({
        draggedItemId: result.draggableId
      });

      if (onDragStart) {
        onDragStart(result.draggableId);
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onDragUpdate", function (update) {
      var onDragUpdate = _this.props.onDragUpdate;
      var onExpand = _this.props.onExpand;
      var flattenedTree = _this.state.flattenedTree;

      if (!_this.dragState) {
        return;
      }

      _this.expandTimer.stop();

      if (update.combine) {
        var draggableId = update.combine.draggableId;

        if (onDragUpdate) {
          onDragUpdate(draggableId);
        }

        var item = (0, _flatTree.getItemById)(flattenedTree, draggableId);

        if (item && _this.isExpandable(item)) {
          _this.expandTimer.start(function () {
            return onExpand(draggableId, item.path);
          });
        }
      } else if (onDragUpdate) {
        onDragUpdate(null);
      }

      _this.dragState = _objectSpread(_objectSpread({}, _this.dragState), {}, {
        destination: update.destination,
        combine: update.combine
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onDropAnimating", function () {
      _this.expandTimer.stop();
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onDragEnd", function (result) {
      var _this$props = _this.props,
          onDragEnd = _this$props.onDragEnd,
          tree = _this$props.tree;
      var flattenedTree = _this.state.flattenedTree;

      _this.expandTimer.stop();

      var finalDragState = _objectSpread(_objectSpread({}, _this.dragState), {}, {
        source: result.source,
        destination: result.destination,
        combine: result.combine
      });

      _this.setState({
        draggedItemId: undefined
      });

      var _calculateFinalDropPo = (0, _TreeUtils.calculateFinalDropPositions)(tree, flattenedTree, finalDragState),
          sourcePosition = _calculateFinalDropPo.sourcePosition,
          destinationPosition = _calculateFinalDropPo.destinationPosition;

      onDragEnd(sourcePosition, destinationPosition);
      _this.dragState = undefined;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "onPointerMove", function () {
      if (_this.dragState) {
        _this.dragState = _objectSpread(_objectSpread({}, _this.dragState), {}, {
          horizontalLevel: _this.getDroppedLevel()
        });
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculateEffectivePath", function (flatItem, snapshot) {
      var _this$state = _this.state,
          flattenedTree = _this$state.flattenedTree,
          draggedItemId = _this$state.draggedItemId;

      if (_this.dragState && draggedItemId === flatItem.item.id && (_this.dragState.destination || _this.dragState.combine)) {
        var _this$dragState = _this.dragState,
            source = _this$dragState.source,
            destination = _this$dragState.destination,
            combine = _this$dragState.combine,
            horizontalLevel = _this$dragState.horizontalLevel,
            mode = _this$dragState.mode; // We only update the path when it's dragged by keyboard or drop is animated

        if (mode === 'SNAP' || snapshot.isDropAnimating) {
          if (destination) {
            // Between two items
            return (0, _flatTree.getDestinationPath)(flattenedTree, source.index, destination.index, horizontalLevel);
          }

          if (combine) {
            // Hover on other item while dragging
            return (0, _flatTree.getDestinationPath)(flattenedTree, source.index, (0, _flatTree.getIndexById)(flattenedTree, combine.draggableId), horizontalLevel);
          }
        }
      }

      return flatItem.path;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "isExpandable", function (item) {
      return !!item.item.hasChildren && !item.item.isExpanded;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "getDroppedLevel", function () {
      var offsetPerLevel = _this.props.offsetPerLevel;
      var draggedItemId = _this.state.draggedItemId;

      if (!_this.dragState || !_this.containerElement) {
        return undefined;
      }

      var containerLeft = (0, _cssBoxModel.getBox)(_this.containerElement).contentBox.left;
      var itemElement = _this.itemsElement[draggedItemId];

      if (itemElement) {
        var currentLeft = (0, _cssBoxModel.getBox)(itemElement).contentBox.left;
        var relativeLeft = Math.max(currentLeft - containerLeft, 0);
        return Math.floor((relativeLeft + offsetPerLevel / 2) / offsetPerLevel) + 1;
      }

      return undefined;
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "patchDroppableProvided", function (provided) {
      return _objectSpread(_objectSpread({}, provided), {}, {
        innerRef: function innerRef(el) {
          _this.containerElement = el;
          provided.innerRef(el);
        }
      });
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "setItemRef", function (itemId, el) {
      if (!!el) {
        _this.itemsElement[itemId] = el;
      }
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderItems", function () {
      var flattenedTree = _this.state.flattenedTree;
      return flattenedTree.map(_this.renderItem);
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderItem", function (flatItem, index) {
      var isDragEnabled = _this.props.isDragEnabled; // If drag and drop is explicitly disabled for all items, render TreeItem directly with stubbed provided and snapshot

      if (isDragEnabled === false) {
        return _this.renderTreeItem({
          flatItem: flatItem,
          path: flatItem.path,
          provided: {
            draggableProps: {
              'data-react-beautiful-dnd-draggable': ''
            },
            innerRef: function innerRef() {},
            dragHandleProps: null
          },
          snapshot: {
            isDragging: false,
            isDropAnimating: false
          }
        });
      }

      var isDragDisabled = typeof isDragEnabled === 'function' ? !isDragEnabled(flatItem.item) : !isDragEnabled;
      return /*#__PURE__*/_react.default.createElement(_reactBeautifulDndNext.Draggable, {
        key: flatItem.item.id,
        draggableId: flatItem.item.id.toString(),
        index: index,
        isDragDisabled: isDragDisabled
      }, _this.renderDraggableItem(flatItem));
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderDraggableItem", function (flatItem) {
      return function (provided, snapshot) {
        var currentPath = _this.calculateEffectivePath(flatItem, snapshot);

        if (snapshot.isDropAnimating) {
          _this.onDropAnimating();
        }

        return _this.renderTreeItem({
          flatItem: flatItem,
          path: currentPath,
          provided: provided,
          snapshot: snapshot
        });
      };
    });
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "renderTreeItem", function (_ref) {
      var flatItem = _ref.flatItem,
          path = _ref.path,
          provided = _ref.provided,
          snapshot = _ref.snapshot;
      var _this$props2 = _this.props,
          renderItem = _this$props2.renderItem,
          onExpand = _this$props2.onExpand,
          onCollapse = _this$props2.onCollapse,
          offsetPerLevel = _this$props2.offsetPerLevel;
      return /*#__PURE__*/_react.default.createElement(_TreeItem.default, {
        key: flatItem.item.id,
        item: flatItem.item,
        path: path,
        onExpand: onExpand,
        onCollapse: onCollapse,
        renderItem: renderItem,
        provided: provided,
        snapshot: snapshot,
        itemRef: _this.setItemRef,
        offsetPerLevel: offsetPerLevel
      });
    });
    return _this;
  }

  (0, _createClass2.default)(Tree, [{
    key: "render",
    value: function render() {
      var _this2 = this;

      var isNestingEnabled = this.props.isNestingEnabled;
      var renderedItems = this.renderItems();
      return /*#__PURE__*/_react.default.createElement(_reactBeautifulDndNext.DragDropContext, {
        onDragStart: this.onDragStart,
        onDragEnd: this.onDragEnd,
        onDragUpdate: this.onDragUpdate
      }, /*#__PURE__*/_react.default.createElement(_reactBeautifulDndNext.Droppable, {
        droppableId: "tree",
        isCombineEnabled: isNestingEnabled,
        ignoreContainerClipping: true
      }, function (provided) {
        var finalProvided = _this2.patchDroppableProvided(provided);

        return /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
          ref: finalProvided.innerRef,
          style: {
            pointerEvents: 'auto'
          },
          onTouchMove: _this2.onPointerMove,
          onMouseMove: _this2.onPointerMove
        }, finalProvided.droppableProps), renderedItems, provided.placeholder);
      }));
    }
  }], [{
    key: "getDerivedStateFromProps",
    value: function getDerivedStateFromProps(props, state) {
      var draggedItemId = state.draggedItemId;
      var tree = props.tree;
      var finalTree = Tree.closeParentIfNeeded(tree, draggedItemId);
      var flattenedTree = (0, _tree.flattenTree)(finalTree);
      return _objectSpread(_objectSpread({}, state), {}, {
        flattenedTree: flattenedTree
      });
    }
  }, {
    key: "closeParentIfNeeded",
    value: function closeParentIfNeeded(tree, draggedItemId) {
      if (!!draggedItemId) {
        // Closing parent internally during dragging, because visually we can only move one item not a subtree
        return (0, _tree.mutateTree)(tree, draggedItemId, {
          isExpanded: false
        });
      }

      return tree;
    }
  }]);
  return Tree;
}(_react.Component);

exports.default = Tree;
(0, _defineProperty2.default)(Tree, "defaultProps", {
  tree: {
    children: []
  },
  onExpand: _handy.noop,
  onCollapse: _handy.noop,
  onDragStart: _handy.noop,
  onDragEnd: _handy.noop,
  renderItem: _handy.noop,
  offsetPerLevel: 35,
  isDragEnabled: false,
  isNestingEnabled: false
});