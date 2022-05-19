"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var DelayedFunction = /*#__PURE__*/function () {
  function DelayedFunction(delay) {
    (0, _classCallCheck2.default)(this, DelayedFunction);
    this.delay = delay;
  }

  (0, _createClass2.default)(DelayedFunction, [{
    key: "start",
    value: function start(fn) {
      this.stop();
      this.timeoutId = window.setTimeout(fn, this.delay);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
      }
    }
  }]);
  return DelayedFunction;
}();

exports.default = DelayedFunction;