"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Service = function Service(name, className) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var shared = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

  _classCallCheck(this, Service);

  _defineProperty(this, "name", void 0);

  _defineProperty(this, "className", void 0);

  _defineProperty(this, "shared", true);

  _defineProperty(this, "args", []);

  _defineProperty(this, "compiled", null);

  this.shared = shared;
  this.name = name;
  this.className = className;
  this.args = args;
};

var DI =
/*#__PURE__*/
function () {
  function DI() {
    _classCallCheck(this, DI);

    _defineProperty(this, "services", {});
  }

  _createClass(DI, [{
    key: "add",
    value: function add(name, className) {
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
      var shared = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      this.services[name] = new Service(name, className, args, shared);
    }
  }, {
    key: "resolve",
    value: function resolve(name) {
      if (!this.services[name]) {
        throw new Error("Service '" + name + "' not found");
      }

      var service = this.services[name];

      if (typeof service.className === 'function') {
        if (service.shared && service.compiled !== null) {
          return service.compiled;
        }

        var args = service.args;
        var resolvedArgs = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = args[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var arg = _step.value;
            var resolvedArg = this.resolve(arg);
            resolvedArgs.push(resolvedArg);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator["return"] != null) {
              _iterator["return"]();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var className = service.className;
        var result = Reflect.construct(className, resolvedArgs);

        if (service.shared) {
          service.compiled = result;
        }

        return result;
      }

      return service.className;
    }
  }]);

  return DI;
}();

exports["default"] = DI;
//# sourceMappingURL=index.js.map