import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";

var DelayedFunction = /*#__PURE__*/function () {
  function DelayedFunction(delay) {
    _classCallCheck(this, DelayedFunction);

    this.delay = delay;
  }

  _createClass(DelayedFunction, [{
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

export { DelayedFunction as default };