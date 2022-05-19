import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _assertThisInitialized from "@babel/runtime/helpers/assertThisInitialized";
import _inherits from "@babel/runtime/helpers/inherits";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

import { Component } from 'react';
import { isSamePath } from '../../utils/path';
import { sameProps } from '../../utils/react';

var TreeItem = /*#__PURE__*/function (_Component) {
  _inherits(TreeItem, _Component);

  var _super = _createSuper(TreeItem);

  function TreeItem() {
    var _this;

    _classCallCheck(this, TreeItem);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "patchDraggableProps", function (draggableProps, snapshot) {
      var _this$props = _this.props,
          path = _this$props.path,
          offsetPerLevel = _this$props.offsetPerLevel;
      var transitions = draggableProps.style && draggableProps.style.transition ? [draggableProps.style.transition] : [];

      if (snapshot.dropAnimation) {
        transitions.push( // @ts-ignore
        "padding-left ".concat(snapshot.dropAnimation.duration, "s ").concat(snapshot.dropAnimation.curve));
      }

      var transition = transitions.join(', ');
      return _objectSpread(_objectSpread({}, draggableProps), {}, {
        style: _objectSpread(_objectSpread({}, draggableProps.style), {}, {
          paddingLeft: (path.length - 1) * offsetPerLevel,
          // @ts-ignore
          transition: transition
        })
      });
    });

    return _this;
  }

  _createClass(TreeItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      return !sameProps(this.props, nextProps, ['item', 'provided', 'snapshot', 'onCollapse', 'onExpand']) || !isSamePath(this.props.path, nextProps.path) || // also rerender tree item even if the item is not draggable, this allows draggable/nondraggable items to behave the same
      this.props.provided.dragHandleProps === null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this$props2 = this.props,
          item = _this$props2.item,
          path = _this$props2.path,
          _onExpand = _this$props2.onExpand,
          _onCollapse = _this$props2.onCollapse,
          renderItem = _this$props2.renderItem,
          provided = _this$props2.provided,
          snapshot = _this$props2.snapshot,
          itemRef = _this$props2.itemRef;

      var innerRef = function innerRef(el) {
        itemRef(item.id, el);
        provided.innerRef(el);
      };

      var finalProvided = {
        draggableProps: this.patchDraggableProps(provided.draggableProps, snapshot),
        dragHandleProps: provided.dragHandleProps,
        innerRef: innerRef
      };
      return renderItem({
        item: item,
        depth: path.length - 1,
        onExpand: function onExpand(itemId) {
          return _onExpand(itemId, path);
        },
        onCollapse: function onCollapse(itemId) {
          return _onCollapse(itemId, path);
        },
        provided: finalProvided,
        snapshot: snapshot
      });
    }
  }]);

  return TreeItem;
}(Component);

export { TreeItem as default };