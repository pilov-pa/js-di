"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Service = function Service(name, className) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var shared = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
  var tags = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];

  _classCallCheck(this, Service);

  _defineProperty(this, "name", void 0);

  _defineProperty(this, "tags", []);

  _defineProperty(this, "className", void 0);

  _defineProperty(this, "shared", true);

  _defineProperty(this, "args", []);

  _defineProperty(this, "compiled", null);

  this.tags = tags;
  this.shared = shared;
  this.name = name;
  this.className = className;
  this.args = args;
};

exports["default"] = Service;
//# sourceMappingURL=Service.js.map