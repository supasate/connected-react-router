"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _immutable = _interopRequireDefault(require("immutable"));

var _getIn = _interopRequireDefault(require("./getIn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var structure = {
  fromJS: function fromJS(jsValue) {
    return _immutable["default"].fromJS(jsValue, function (key, value) {
      return _immutable["default"].Iterable.isIndexed(value) ? value.toList() : value.toMap();
    });
  },
  getIn: _getIn["default"],
  merge: function merge(state, payload) {
    return _immutable["default"].merge(state, payload);
  },
  toJS: function toJS(value) {
    return _immutable["default"].Iterable.isIterable(value) ? value.toJS() : value;
  }
};
var _default = structure;
exports["default"] = _default;